const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
    },
    products: [
        {
            name: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true }, // Price in cents
            quantity: { type: Number, required: true },
        },
    ],
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Payment', paymentSchema);
