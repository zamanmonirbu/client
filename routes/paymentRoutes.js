import express from 'express';
import { createPaymentSession } from '../controllers/payment.js'

const router = express.Router();

// Define routes
router.post('/create-checkout-session', createPaymentSession);

export default router; // Use `export default` for consistency with ES Modules
