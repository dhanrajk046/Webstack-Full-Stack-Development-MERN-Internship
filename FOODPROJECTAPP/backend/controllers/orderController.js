const Order = require("../models/order");
const FoodItem = require("../models/foodItem");
const Cart = require("../models/cartModel");
const { ObjectId } = require("mongodb");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

// Notice: We removed Stripe from the top of the file entirely!

// Create a new order   =>  /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  
  // THE FIX: Initialize Stripe inside the function!
  // By the time a user triggers this route, the server is fully booted 
  // and process.env.STRIPE_SECRET_KEY is guaranteed to be loaded.
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const { session_id } = req.body;

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["customer"],
  });
  console.log(session);

  const cart = await Cart.findOne({ user: req.user._id })
    .populate({
      path: "items.foodItem",
      select: "name price images",
    })
    .populate({
      path: "restaurant",
      select: "name",
    });
  console.log(cart);

  let deliveryInfo = {
    address: session.shipping_details.address.line1 + 
      (session.shipping_details.address.line2 ? " " + session.shipping_details.address.line2 : ""),
    city: session.shipping_details.address.city,
    phoneNo: session.customer_details.phone,
    postalCode: session.shipping_details.address.postal_code,
    country: session.shipping_details.address.country,
  };

  let orderItems = cart.items.map((item) => ({
    name: item.foodItem.name,
    quantity: item.quantity,
    image: item.foodItem.images[0].url,
    price: item.foodItem.price,
    fooditem: item.foodItem._id,
  }));

  let paymentInfo = {
    id: session.payment_intent,
    status: session.payment_status,
  };

  const order = await Order.create({
    orderItems,
    deliveryInfo,
    paymentInfo,
    deliveryCharge: +session.shipping_cost.amount_subtotal / 100,
    itemsPrice: +session.amount_subtotal / 100,
    finalTotal: +session.amount_total / 100,
    user: req.user.id,
    restaurant: cart.restaurant._id,
    paidAt: Date.now(),
  });
  console.log(order);

  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(200).json({
    success: true,
    order,
  });
});

// Place order directly from cart   =>   /api/v1/eats/orders/place-order
exports.placeOrderFromCart = catchAsyncErrors(async (req, res, next) => {
  const { deliveryInfo } = req.body;

  if (
    !deliveryInfo ||
    !deliveryInfo.address ||
    !deliveryInfo.city ||
    !deliveryInfo.phoneNo ||
    !deliveryInfo.postalCode ||
    !deliveryInfo.country
  ) {
    return next(new ErrorHandler("Complete delivery details are required", 400));
  }

  const cart = await Cart.findOne({ user: req.user._id })
    .populate({
      path: "items.foodItem",
      select: "name price images stock",
    })
    .populate({
      path: "restaurant",
      select: "name",
    });

  if (!cart || cart.items.length === 0) {
    return next(new ErrorHandler("Your cart is empty", 400));
  }

  const orderItems = cart.items.map((item) => ({
    name: item.foodItem.name,
    quantity: item.quantity,
    image: item.foodItem.images?.[0]?.url || "/images/placeholder.png",
    price: item.foodItem.price,
    fooditem: item.foodItem._id,
  }));

  const itemsPrice = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const deliveryCharge = itemsPrice > 0 ? 40 : 0;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const finalTotal = itemsPrice + deliveryCharge + taxPrice;

  const order = await Order.create({
    orderItems,
    deliveryInfo,
    paymentInfo: {
      id: `COD-${Date.now()}`,
      status: "Cash on Delivery",
    },
    deliveryCharge,
    taxPrice,
    itemsPrice,
    finalTotal,
    user: req.user._id,
    restaurant: cart.restaurant._id,
  });

  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get single order   =>   /api/v1/orders/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get logged in user orders   =>   /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const userId = new ObjectId(req.user.id);
  const orders = await Order.find({ user: userId })
    .populate("user", "name email")
    .populate("restaurant")
    .sort({ createdAt: -1 })
    .exec();

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders - ADMIN  =>   /api/v1/admin/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.finalTotal;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});
