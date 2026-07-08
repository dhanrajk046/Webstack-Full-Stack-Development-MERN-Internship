const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const aiController = require("../controllers/aiController");

router.post(
  "/generate-description",
  authController.protect,
  aiController.generateDescription
);

router.post(
  "/analyze-reviews",
  authController.protect,
  aiController.analyzeReviews
);

module.exports = router;
