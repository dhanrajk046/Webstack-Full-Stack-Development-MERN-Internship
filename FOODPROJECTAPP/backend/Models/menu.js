const mongoose = require("mongoose");
const restaurant = require("./restaurant");

const menuSchema = new mongoose.Schema(
  {
    menu: [
      {
        category: { type: String },
        items: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FoodItem"
          },
        ],
      },
    ],
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ... your schema definitions above ...

// 1. You must define the model and assign it to the variable 'Menu'
const Menu = mongoose.model('Menu', menuSchema); 

// 2. Then you can export it
module.exports = Menu;