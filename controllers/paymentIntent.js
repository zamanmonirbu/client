import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const paymentIntent = async (req, res) => {
  const { items } = req.body;

  // Validate input
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Items array is required and cannot be empty.' });
  }

  try {
    // Calculate the total amount in the smallest currency unit (e.g., cents for USD)
    const totalAmount = items.reduce((total, item) => {
      if (!item.price || !item.quantity) {
        throw new Error('Each item must have a price and quantity.');
      }
      return total + item.price * item.quantity * 100; // Multiply by 100 for cents
    }, 0);

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd', // Use your desired currency
    });

    // Respond with the client secret
    res.status(200).json({
      message: 'Successfully created the payment intent.',
      client_secret: paymentIntent.client_secret, // Key needed by frontend
    });
  } catch (error) {
    console.error('Error creating payment intent:', error.message);
    res.status(500).json({
      message: 'Failed to create the payment intent.',
      error: error.message,
    });
  }
};
