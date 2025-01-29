import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  paymentId: String,
  amount: Number,
  currency: String,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
