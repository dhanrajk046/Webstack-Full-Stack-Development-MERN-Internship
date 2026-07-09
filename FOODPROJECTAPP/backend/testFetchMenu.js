const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const Menu = require('./Models/menu');
const FoodItem = require('./Models/foodItem');

async function run() {
  await mongoose.connect(process.env.DB_URL);
  const storeId = "66716cb0e1a78e67dc8c8dbf";
  
  const menuDocs = await Menu.find({ restaurant: storeId }).populate("menu.items");
  console.log("menuDocs length:", menuDocs.length);
  if (menuDocs.length > 0) {
    const doc = menuDocs[0];
    console.log("Menu document restaurant ID:", doc.restaurant.toString());
    const payload = doc.menu.map((catBlock) => ({
      _id: doc._id + "-" + catBlock._id,
      category: catBlock.category,
      items: catBlock.items.map(item => item ? item.name : null),
    }));
    console.log("Payload:", JSON.stringify(payload, null, 2));
  } else {
    console.log("No menuDocs found!");
  }
  await mongoose.disconnect();
}
run().catch(console.error);
