const express = require("express");
const router = express.Router();

// 1. Import your controller functions
// VITAL: Ensure "sendStripeApi" matches exactly what is in your paymentController.js!
const {
  processPayment,
  sendStripeApi 
} = require("../controllers/paymentController");

// 2. Import your authentication middleware so only logged-in users can pay
const { protect } = require("../controllers/authController");

// 3. Define the routes
// Endpoint to process the actual payment
router.route("/payment/process").post(protect, processPayment);

// Endpoint to send the Stripe Publishable API key to your frontend
router.route("/stripeapi").get(protect, sendStripeApi);

module.exports = router;