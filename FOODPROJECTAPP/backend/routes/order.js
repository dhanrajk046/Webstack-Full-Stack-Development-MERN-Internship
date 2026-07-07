const express = require("express");
const router = express.Router();

const {
  newOrder,
  placeOrderFromCart,
  getSingleOrder,
  myOrders,
} = require("../controllers/orderController");

const authController = require("../controllers/authController");

router.route("/new").post(authController.protect, newOrder);
router.route("/place-order").post(authController.protect, placeOrderFromCart);
router.route("/me/myOrders").get(authController.protect, myOrders);

router.route("/:id").get(authController.protect, getSingleOrder);

module.exports = router;
