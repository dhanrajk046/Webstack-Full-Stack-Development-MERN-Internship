// //import req package, files
// const User = require("../models/user");

// console.log("User Model:", User);
// const Errorhandler = require("../utils/errorHandler")
// const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
// const sendToken = require("../utils/sendToken")
// const cloudinary = require("../config/cloudinary")

// //Signup
// exports.signup = catchAsyncErrors(async(req,res,next) =>{
//     const {name,email,password,passwordConfirm,phoneNumber} = req.body;

//     let avatar={}
//     //avatar not provided
//     if(!req.body.avatar || req.body.avatar === "/images/images.png"){
//         avatar = {
//             public_id: "default",
//             url: "/images/images.png"
//         }
//     }
//     else{
//         const result =await cloudinary.uploader.upload(req.body.avatar,{
//             folder:"avatar",
//             width:150,
//             crop:"scale",
//         })
//         avatar = {
//             public_id:result.public_id,
//             url:result.url
//         }
//     }
    
//     const user = await User.create({
//         name,
//         email,
//         password,
//         passwordConfirm,
//         phoneNumber,
//         avatar
//     })
//     sendToken(user, 200, res)
// })

// Import required packages and files
const User = require("../models/user");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/sendToken");
const cloudinary = require("../config/cloudinary");
const ErrorHandler = require("../utils/errorHandler");

console.log("User Model loaded into authController:", User);

// @desc    Register a new user
// @route   POST /api/v1/users/signup
// @access  Public
exports.signup = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, passwordConfirm, phoneNumber, avatar: incomingAvatar } = req.body;

    // Set fallback default avatar values
    let avatar = {
        public_id: "default",
        url: "/images/images.png"
    };

    // Only trigger Cloudinary upload if a valid string asset/base64 is actually sent
    if (incomingAvatar && incomingAvatar !== "" && incomingAvatar !== "/images/images.png") {
        try {
            const result = await cloudinary.uploader.upload(incomingAvatar, {
                folder: "avatar",
                width: 150,
                crop: "scale",
            });

            avatar = {
                public_id: result.public_id,
                url: result.secure_url // Secure HTTPS link from Cloudinary
            };
        } catch (cloudinaryError) {
            return next(new Errorhandler(`Image Upload Failed: ${cloudinaryError.message}`, 400));
        }
    }

    // Create user in MongoDB
    const user = await User.create({
        name,
        email,
        password,
        passwordConfirm,
        phoneNumber,
        avatar
    });

    // Send JWT token authentication response
    sendToken(user, 201, res);
});

//login
// exports.login = catchAsyncErrors{async(req,res,next)=>{
exports.login = catchAsyncErrors(async(req,res,next)=>{

    const {email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password", 400))
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.correctPassword(password, user.password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    sendToken(user, 200, res)


});