import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
  },
  products: [
    {
      name: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
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

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment; // Use `export default` for ES Modules
