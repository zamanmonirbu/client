const Payment = require("../models/payment");
const stripe = require('stripe')("sk_test_51OQBiWIHoIMM5DdU1utEYQkdD6Ca9ZETR2rrRxfkQVnOWOqOVn0p7Hg8z9xV0xdZoNZAoOw4zHoVIEctDHdr1LWQ00Yw6YVHII");

const createPaymentSession = async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products) || products.some(product => !product.name || !product.image || !product.price || !product.quantity)) {
            return res.status(400).json({ error: "Invalid products array" });
        }

        const lineItems = products.map(product => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.name,
                    images: [product.image],
                },
                unit_amount: Math.round(product.price * 100),
            },
            quantity: product.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: process.env.SUCCESS_URL || 'http://localhost:5173/',
            cancel_url: process.env.CANCEL_URL || 'http://localhost:5173/',
        });

        const payment = new Payment({
            sessionId: session.id,
            products,
        });
        await payment.save();

        res.json({ id: session.id });
    } catch (error) {
        console.error("Error creating payment session:", error.message);
        res.status(500).json({ error: 'Failed to create payment session' });
    }
};

module.exports = { createPaymentSession };
