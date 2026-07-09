const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// Public routes — no auth required so all users (logged-in or not) can access AI features
router.post("/generate-description", aiController.generateDescription);
router.post("/analyze-reviews", aiController.analyzeReviews);

module.exports = router;
