const express = require('express');
const { initiatePayment, handleWebhook } = require('../controllers/paymentController');

const router = express.Router();

router.post('/initiate', initiatePayment); // Payment initiation
router.post('/webhook', handleWebhook);   // Webhook endpoint

module.exports = router;
