console.log("Auth.js loaded");

const express = require("express");
const router = express.Router();
const authentication = require("../controllers/authController");

router.get("/test", (req, res) => {
  res.send("Auth Route Working");
});

router.post("/signup", authentication.signup);
router.post("/login",authentication.login)

module.exports = router;
