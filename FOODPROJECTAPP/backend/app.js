const express = require("express");
const app = express();

const path = require("path");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const errorMiddleware = require("./middlewares/errors");

// --- Routes Imports ---
const foodRouter = require("./routes/foodItem");
const restaurant = require("./routes/restaurant"); // Ensure this file exists in the routes folder!
const menuRouter = require("./routes/menu");
const order = require("./routes/order");
const auth = require("./routes/auth");
const payment = require("./routes/payment");
const cart = require("./routes/cart");

// --- Middlewares ---
app.use(cors());
app.use(cookieParser());
app.use(fileUpload());

app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true, limit: "30kb" }));

// --- Mount Routes ---
app.use("/api/v1/eats", foodRouter);
app.use("/api/v1/eats/menus", menuRouter);
app.use("/api/v1/eats/stores", restaurant);
app.use("/api/v1/eats/orders", order);
app.use("/api/v1/users", auth);
app.use("/api/v1", payment);
app.use("/api/v1/eats/cart", cart);

// --- View Engine ---
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// --- 404 Handler ---
app.use((req, res, next) => {
  // Using standard Node.js Error to prevent crashes if custom ErrorHandler is missing
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// --- Global Error Handler ---
app.use(errorMiddleware);

module.exports = app;