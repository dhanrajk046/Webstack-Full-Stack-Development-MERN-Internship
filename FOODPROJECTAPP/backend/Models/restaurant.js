const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a restaurant name"],
      trim: true,
    },
    isVeg: { type: Boolean, default: false },
    address: { type: String },
    ratings: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    location: {
      type: { type: String },
      coordinates: [Number],
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    reviews: [
      {
        name: String,
        rating: Number,
        Comment: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
