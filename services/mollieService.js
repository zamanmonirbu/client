const { createMollieClient } = require('@mollie/api-client');
require('dotenv').config();

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

const createPayment = async (amount, description, method) => {
  const formattedAmount = parseFloat(amount).toFixed(2);
  return await mollieClient.payments.create({
    amount: { value: formattedAmount, currency: 'EUR' },
    description,
    redirectUrl: process.env.REDIRECT_URL,
    webhookUrl: process.env.WEBHOOK_URL,
    method, 
  });
};

const getPaymentStatus = async (paymentId) => {
  return await mollieClient.payments.get(paymentId);
};

module.exports = { createPayment, getPaymentStatus };
