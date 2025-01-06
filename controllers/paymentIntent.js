import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const paymentIntent = async (req, res) => {
  const { amount, currency } = req.body

  // Validate input
  if (!amount || !currency) {
    return res
      .status(400)
      .json({ message: 'Amount and currency are required.' })
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount provided.' })
  }

  try {
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount is in the smallest currency unit (e.g., cents for USD)
      currency,
    })

    // Respond with the client secret
    res.status(200).json({
      message: 'Successfully created the payment intent.',
      client_secret: paymentIntent.client_secret, // Key needed by frontend
    })
  } catch (error) {
    console.error('Error creating payment intent:', error.message)
    res.status(500).json({
      message: 'Failed to create the payment intent.',
      error: error.message,
    })
  }
}

// import Stripe from 'stripe'
// import dotenv from 'dotenv'
// dotenv.config()

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// export const paymentIntent = async (req, res) => {
//   const { amount, currency } = req.body

//   // Validate input
//   if (!amount || !currency) {
//     return res
//       .status(400)
//       .json({ message: 'Amount and currency are required.' })
//   }
//   if (typeof amount !== 'number' || amount <= 0) {
//     return res.status(400).json({ message: 'Invalid amount provided.' })
//   }

//   try {
//     // Create a payment intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//     })

//     res.status(200).json({
//       message: 'Successfully created the payment intent.',
//       paymentIntent,
//     })
//   } catch (error) {
//     console.error('Error creating payment intent:', error)
//     res.status(400).json({
//       message: 'Failed to create the payment intent.',
//       error: error.message,
//     })
//   }
// }
