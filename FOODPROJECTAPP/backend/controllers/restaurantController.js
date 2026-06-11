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