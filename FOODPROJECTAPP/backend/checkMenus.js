const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const Menu = require('./Models/menu');
const FoodItem = require('./Models/foodItem');
const Restaurant = require('./Models/restaurant');

async function run() {
  await mongoose.connect(process.env.DB_URL);
  const r = await Restaurant.findOne({ name: /haldiram/i });
  console.log("Restaurant:", r.name, "ID:", r._id.toString());
  const menus = await Menu.find({ restaurant: r._id }).populate("menu.items");
  console.log("Menus count:", menus.length);
  menus.forEach(m => {
    console.log("Menu document ID:", m._id.toString());
    console.log("Categories block:");
    m.menu.forEach(cat => {
      console.log(`  Category: "${cat.category}" (items count: ${cat.items.length})`);
    });
  });
  await mongoose.disconnect();
}
run().catch(console.error);
