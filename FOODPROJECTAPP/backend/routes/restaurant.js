
const express = require("express");
const router = express.Router();
const authentication = require("../controllers/restaurantController");

router.route("/").get(authentication.getAllRestaurants)


module.exports = router;