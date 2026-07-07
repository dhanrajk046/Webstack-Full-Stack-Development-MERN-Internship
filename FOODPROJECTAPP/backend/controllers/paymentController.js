const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  // Dynamically reload environment variables in case config.env changed without server restart
  require("dotenv").config({ path: require("path").join(__dirname, "../config/config.env") });
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  console.log(req.body);

  // create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    customer_email: req.user.email,
    phone_number_collection: {
      enabled: true,
    },
    line_items: req.body.items.map((item) => {
      const food = item.foodItem || item;
      const imageUrl = food.images?.[0]?.url || "";
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: food.name || "Food Item",
            ...(imageUrl ? { images: [imageUrl] } : {}),
          },
          unit_amount: Math.round((food.price || 0) * 100),
        },
        quantity: item.quantity || 1,
      };
    }),
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["US", "IN"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery Charges",
          type: "fixed_amount",
          fixed_amount: {
            amount: 4000, // amount in paise (4000 = 40INR delivery charge)
            currency: "inr", // REQUIRED: currency must match line_items currency
          },
          // FIXED: Stripe API requires "delivery_estimate" (no 'd' at the end)
          delivery_estimate: {
            minimum: {
              unit: "hour",
              value: 1,
            },
            maximum: {
              unit: "hour",
              value: 3,
            },
          },
        },
      },
    ],
    // FIXED: Changed '=' to ':'
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
  });

  // FIXED: Changed 'res,status' to 'res.status'
  res.status(200).json({ url: session.url });
});

// send stripe api key
// THE FINAL FIX: Renamed from sendStringApi to sendStripeApi
exports.sendStripeApi = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    // Ensure this variable perfectly matches the Publishable key in your config.env file
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
});