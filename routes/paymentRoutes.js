const express = require("express");
const { createPaymentSession } = require("../controllers/payment");
const router = express.Router();


// router.post("/create-payment-intent", placementOrder);
router.post("/create-checkout-session", createPaymentSession);




module.exports = router;
