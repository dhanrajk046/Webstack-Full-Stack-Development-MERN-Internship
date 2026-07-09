const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const Menu = require('./Models/menu');
const FoodItem = require('./Models/foodItem');
const Restaurant = require('./Models/restaurant');

async function run() {
  await mongoose.connect(process.env.DB_URL);
  
  const restaurant = await Restaurant.findOne({ name: /haldiram/i });
  const restaurantId = restaurant._id.toString();
  console.log("Restaurant ID:", restaurantId);

  // 1. Create the food item
  const foodItem = await FoodItem.create({
    name: "Special Rasmalai Cup",
    price: 120,
    description: "Delicious spongy cottage cheese balls soaked in sweetened, thickened milk flavored with cardamom.",
    stock: 30,
    restaurant: restaurantId,
    images: [{
      public_id: `custom_${Date.now()}`,
      url: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&auto=format&fit=crop"
    }]
  });
  console.log("FoodItem created:", foodItem.name, "ID:", foodItem._id.toString());

  // 2. Find or create the Menu document
  let menu = await Menu.findOne({ restaurant: restaurantId });
  if (!menu) {
    menu = await Menu.create({ restaurant: restaurantId, menu: [] });
  }

  // 3. Find or create the category "Desserts & Delights"
  const category = "Desserts & Delights";
  let cat = menu.menu.find(
    (c) => c.category.toLowerCase().trim() === category.toLowerCase().trim()
  );

  if (!cat) {
    cat = { category: category.trim(), items: [] };
    menu.menu.push(cat);
  }

  // 4. Push and save
  cat.items.push(foodItem._id);
  menu.markModified("menu");
  await menu.save();
  console.log("Menu document updated! Saved category:", cat.category);

  // 5. Query and verify the output structure
  const menuDocs = await Menu.find({ restaurant: restaurantId }).populate("menu.items");
  console.log("\n--- VERIFICATION PAYLOAD ---");
  const payload = menuDocs.flatMap((doc) =>
    doc.menu.map((catBlock) => ({
      category: catBlock.category,
      items: catBlock.items.map(item => item ? item.name : null),
    }))
  );
  console.log(JSON.stringify(payload, null, 2));

  await mongoose.disconnect();
}
run().catch(console.error);
