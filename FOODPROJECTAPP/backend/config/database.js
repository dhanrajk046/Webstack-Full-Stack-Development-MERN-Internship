const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Attempting DB connection...");
    await mongoose.connect(process.env.DB_URL);
    console.log("Database Connected");
  } catch (error) {
    console.log("Database connection error:", error.message || error);
    process.exit(1);
  }
};

module.exports = connectDB;
