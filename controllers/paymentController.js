const { createPayment, getPaymentStatus } = require('../services/mollieService');


exports.initiatePayment = async (req, res) => {
  try {
    const { items, method } = req.body;    

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items found for payment.' });
    }

    // Calculate total amount from items
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const formattedAmount = totalAmount.toFixed(2); // Ensures "XX.XX" format

    // Description for the payment
    const description = items.map(item => item.name).join(", ");

    // Create a payment in Mollie
    const payment = await createPayment(formattedAmount, description, method);


    res.status(200).json({ paymentUrl: payment.getCheckoutUrl() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment initiation failed', error: error.message });
  }
};


exports.handleWebhook = async (req, res) => {
  const paymentId = req.body.id;

  try {
    // Get payment status from Mollie
    const payment = await getPaymentStatus(paymentId);

    // Log or process the payment status (optional)
    console.log(`Payment ${paymentId} status: ${payment.status}`);

    res.status(200).send('Webhook received');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Webhook handling failed', error: error.message });
  }
};
