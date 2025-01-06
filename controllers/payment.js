import Payment from '../models/payment.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.STRIPE_SECRET_KEY; // Corrected spelling
if (!secretKey) {
  throw new Error('SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(secretKey);

export const createPaymentSession = async (req, res) => {
  try {
    const { products } = req.body;

    console.log(products[0]);

    // Validate products array
    if (
      !Array.isArray(products) ||
      products.some((product) => 
        !product.price_data || 
        !product.quantity ||
        typeof product.quantity !== 'number'
      )
    ) {
      return res.status(400).json({ error: 'Invalid products array' });
    }

    // Map frontend data to Stripe's `line_items`
    const lineItems = products.map((product) => ({
      price_data: {
        currency: product.price_data.currency,
        product_data: {
          name: product.price_data.product_data.name,
          images: Array.isArray(product.price_data.product_data.images)
            ? product.price_data.product_data.images
            : [],
        },
        unit_amount: product.price_data.unit_amount, // Amount in cents
      },
      quantity: product.quantity,
    }));

    // Create a Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: process.env.SUCCESS_URL || 'http://localhost:5173/checkout/success',
      cancel_url: process.env.CANCEL_URL || 'http://localhost:5173/checkout/cancel',
    });

    // Save session details to the database
    const payment = new Payment({
      sessionId: session.id,
      products: products.map((product) => ({
        name: product.price_data.product_data.name,
        image: Array.isArray(product.price_data.product_data.images)
          ? product.price_data.product_data.images[0] || ''
          : '',
        price: product.price_data.unit_amount, // Price in cents
        quantity: product.quantity,
      })),
    });
    await payment.save();

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating payment session:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: 'Failed to create payment session' });
  }
};
