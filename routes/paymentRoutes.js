import express from 'express';
import { createPaymentSession } from '../controllers/paymentControllers.js'; // Include `.js` for ES Modules

const router = express.Router();

// Define routes
router.post('/create-checkout-session', createPaymentSession);

export default router; // Use `export default` for consistency with ES Modules
