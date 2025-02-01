const { createMollieClient } = require('@mollie/api-client');
require('dotenv').config();

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

const createPayment = async (amount, description, method) => {
  const formattedAmount = parseFloat(amount).toFixed(2);
  const payment = await mollieClient.payments.create({
    amount: { value: formattedAmount, currency: 'EUR' },
    description,
    redirectUrl: `${process.env.BASE_REDIRECT_URL}?paymentId={paymentId}`,
    webhookUrl: process.env.WEBHOOK_URL,
    method,
  });

  return payment;
};

module.exports = { createPayment };
