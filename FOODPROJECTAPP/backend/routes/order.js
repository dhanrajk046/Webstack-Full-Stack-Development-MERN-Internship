const express = require("express");
const router = express.Router();

const {
  newOrder,
  placeOrderFromCart,
  getSingleOrder,
  myOrders,
  cancelOrder,
} = require("../controllers/orderController");

const authController = require("../controllers/authController");

router.route("/new").post(authController.protect, newOrder);
router.route("/place-order").post(authController.protect, placeOrderFromCart);
router.route("/me/myOrders").get(authController.protect, myOrders);

// IMPORTANT: /:id/cancel MUST come before /:id so Express doesn't
// treat "cancel" as an :id value
router.route("/:id/cancel").patch(authController.protect, cancelOrder);
router.route("/:id").get(authController.protect, getSingleOrder);

module.exports = router;
