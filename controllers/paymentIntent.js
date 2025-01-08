import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe("sk_test_51Nwt8KJkLvblZeilCj18Ez4zee3T65g2PBVA66iLOk2ikccGCOcu2EUOx0uc2G88bdM2EnD2GIhmXLdcNQpyiVpj00P6pwrYE6    ");

export const paymentIntent = async (req, res) => {
  const { items } = req.body;

  // Validate input
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Items array is required and cannot be empty.' });
  }

  try {
   // Calculate the total amount in the smallest currency unit (cents)
const totalAmount = items.reduce((total, item) => {
  if (!item.price || !item.quantity || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
    throw new Error('Each item must have a valid price and quantity.');
  }
  return total + Math.round(item.price * item.quantity * 100); // Round to avoid precision issues
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



export const payWithIdeal = async (req, res) => {
  const {
    dataPass: { method },
    items,
  } = req.body;



  // console.log(req.body)


  // Validate input
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items array is required and cannot be empty.' });
  }

  if (!method || method !== 'ideal') {
    return res.status(400).json({ error: 'Invalid or missing payment method.' });
  }

  try {
    // Calculate the total amount in cents
    const totalAmount = items.reduce((total, item) => {
      if (
        !item.price ||
        !item.quantity ||
        typeof item.price !== 'number' ||
        typeof item.quantity !== 'number'
      ) {
        throw new Error('Each item must have a valid price and quantity.');
      }
      return total + Math.round(item.price * item.quantity * 100); // Convert to cents
    }, 0);

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['ideal'], // iDEAL payment method
      line_items: items.map((item) => ({
        price_data: {
          currency: 'eur', // Currency for iDEAL payments
          product_data: {
            name: item.name,
            description: `${item.storage}, ${item.color}, ${item.condition}`, // Item details
            images: [item.image], // Product image
          },
          unit_amount: Math.round(item.price * 100), // Convert price to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',

      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`, // Update with your frontend success URL
  cancel_url: `${process.env.CLIENT_URL}/checkout/cancel`, // Update with your frontend cancel URL

     
    });

    // Respond with the session URL for frontend redirection
    res.status(200).json({
      message: 'Successfully created iDEAL payment session.',
      paymentUrl: session.url,
    });
  } catch (err) {
    console.error('Error creating iDEAL payment session:', err.message);
    res.status(500).json({
      error: 'Failed to create payment session.',
      details: err.message,
    });
  }
};
