const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const cartController = require("../controllers/cartController");

// Require authentication for all cart operations
router.post(
  "/add-to-cart",
  authController.protect,
  cartController.addItemToCart,
);
router.post(
  "/update-cart-item",
  authController.protect,
  cartController.updateCartItemQuantity,
);
router.delete(
  "/delete-cart-item",
  authController.protect,
  cartController.deleteCartItem,
);
router.get("/get-cart", authController.protect, cartController.getCartItem);

module.exports = router;
