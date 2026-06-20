// Inside routes/restaurant.js
const express = require("express");
const router = express.Router({ mergeParams: true });

// Assuming your controllers folder is one level up from your routes folder
const {
  getAllRestaurants,
  createRestaurant,
  getRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");

const { protect } = require("../controllers/authController");
const { authorizeRoles } = require("../middlewares/authorizeRoles");

// Assuming menu route is in the same routes folder
const menuRoutes = require("./menu");

router
  .route("/")
  .get(getAllRestaurants)
  .post(protect, authorizeRoles("admin"), createRestaurant);

router
  .route("/:storeId")
  .get(getRestaurant)
  .delete(protect, authorizeRoles("admin"), deleteRestaurant);

router.use("/:storeId/menus", menuRoutes);

module.exports = router;