// 1. Import your Restaurant model so you can talk to the database
// Note: Double check that this path matches your actual file structure
const Restaurant = require("../Models/restaurant");

// @desc    Get all restaurants
// @route   GET /api/restaurants (or whatever your base route is)
// @access  Public
const getAllRestaurants = async (req, res) => {
  try {
    // Support a simple keyword search on `name` and `address`
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { address: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    const restaurants = await Restaurant.find(keyword);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch restaurants",
      error: error.message,
    });
  }
};

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
const createRestaurant = async (req, res) => {
  try {
    // Creates a new restaurant using the JSON data sent in the request body
    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid data: Could not create restaurant",
      error: error.message,
    });
  }
};

// @desc    Get a single restaurant
// @route   GET /api/restaurants/:storeId
// @access  Public
const getRestaurant = async (req, res) => {
  try {
    // req.params.storeId perfectly matches the "/:storeId" in your route file
    const restaurant = await Restaurant.findById(req.params.storeId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    // If the storeId format is completely wrong, Mongoose throws a CastError
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found (Invalid ID format)",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete a restaurant
// @route   DELETE /api/restaurants/:storeId
// @access  Private/Admin
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.storeId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: "Restaurant successfully deleted",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found (Invalid ID format)",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// VITAL: Exporting all functions so your routes file can use them
module.exports = {
  getAllRestaurants,
  createRestaurant,
  getRestaurant,
  deleteRestaurant,
};
