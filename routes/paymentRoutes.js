const express = require('express');
const { getPaymentStatus } = require('../services/mollieService');
const router = express.Router();

router.get('/payment/status', async (req, res) => {
  const { paymentId } = req.query;

  try {
    const payment = await getPaymentStatus(paymentId);

    switch (payment.status) {
      case 'paid':
        return res.redirect(process.env.SUCCESS_URL);
      case 'canceled':
        return res.redirect(process.env.CANCELED_URL);
      case 'failed':
        return res.redirect(process.env.FAILED_URL);
      default:
        return res.redirect(process.env.PENDING_URL);
    }
  } catch (error) {
    console.error(error);
    return res.redirect(process.env.ERROR_URL);
  }
});

module.exports = router;