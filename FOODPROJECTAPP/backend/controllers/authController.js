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
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const User = require("../Models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const sendToken = require("../utils/sendToken");
const cloudinary = require("../config/cloudinary");
const Email = require("../utils/email");

// @desc    Register a new user
// @route   POST /api/v1/users/signup
// @access  Public
exports.signup = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    email,
    password,
    passwordConfirm,
    phoneNumber,
    avatar: incomingAvatar,
  } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedPhone = phoneNumber?.trim();

  if (!name || !normalizedEmail || !password || !passwordConfirm || !normalizedPhone) {
    return next(
      new ErrorHandler("Please provide all required signup fields", 400),
    );
  }

  if (password !== passwordConfirm) {
    return next(new ErrorHandler("Passwords must match", 400));
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return next(
      new ErrorHandler("An account with this email already exists", 400),
    );
  }

  // Set fallback default avatar values
  let avatar = {
    public_id: "default",
    url: "/images/images.png",
  };

  // Only trigger Cloudinary upload if a valid string asset/base64 is actually sent
  if (
    incomingAvatar &&
    incomingAvatar !== "" &&
    incomingAvatar !== "/images/images.png"
  ) {
    try {
      const result = await cloudinary.uploader.upload(incomingAvatar, {
        folder: "avatar",
        width: 150,
        crop: "scale",
      });

      avatar = {
        public_id: result.public_id,
        url: result.secure_url, // Secure HTTPS link from Cloudinary
      };
    } catch (cloudinaryError) {
      return next(
        new ErrorHandler(
          `Image Upload Failed: ${cloudinaryError.message}`,
          400,
        ),
      );
    }
  }

  // Create user in MongoDB
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    passwordConfirm,
    phoneNumber: normalizedPhone,
    avatar,
  });

  // Send JWT token authentication response
  sendToken(user, 201, res);
});

//login
// exports.login = catchAsyncErrors{async(req,res,next)=>{
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
    "+password",
  );

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.correctPassword(password, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

//update...............

// Protect Route
exports.protect = catchAsyncErrors(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new ErrorHandler(
        "You are not logged in! Please log in to get access.",
        401,
      ),
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new ErrorHandler("User no longer exists. Please login again.", 401),
    );
  }

  if (currentUser.changepasswordAfter(decoded.iat)) {
    return next(
      new ErrorHandler(
        "User recently changed password ! please log in again.",
        404,
      ),
    );
  }

  req.user = currentUser;

  next();
});

// Get profile
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

// Update Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, newPasswordConfirm } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  const isMatched = await user.correctPassword(oldPassword, user.password);

  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// Update Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
  };

  Object.keys(newUserData).forEach((key) => {
    if (!newUserData[key]) {
      delete newUserData[key];
    }
  });

  if (req.body.email) {
    newUserData.email = req.body.email.trim().toLowerCase();
  }

  if (req.body.avatar && req.body.avatar !== "/images/images.png") {
    const user = await User.findById(req.user.id);

    const image_id = user.avatar?.public_id;

    if (image_id && image_id !== "default") {
      await cloudinary.uploader.destroy(image_id);
    }

    const result = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: { user },
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("There is no user with email address .", 404));
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${process.env.FRONTEND_URL}/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorHandler(
        "There was an error sending the email, try again later!",
        500,
      ),
    );
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("jwt", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});
