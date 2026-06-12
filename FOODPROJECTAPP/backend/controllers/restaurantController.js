const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../Middlewares/catchAsyncErrors")
const APIFeatures = require("../utils/apiFeatures")
const Restaurant = require("../models/restaurant")

//get all restaurants
exports.getAllRestaurants = catchAsyncErrors(async(req,res,next)=>{
    const apiFeatures = new APIFeatures(Restaurant.find(), req.query).search().sort()

    const restaurants = await apiFeatures.query
    res.status(200).json({
        status:"Success",
        count:restaurants.length,
        restaurant:restaurants    
    })
})

exports.getRestaurant = catchAsyncErrors(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.storeId);

    if (!restaurant) {
        return next(new ErrorHandler("No Restaurant found with the ID", 404));
    }

    res.status(200).json({
        status: "Success",
        data: restaurant
    });
});