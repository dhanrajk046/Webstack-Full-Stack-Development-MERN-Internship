/**
 * Adds veg food items to the existing Haldiram's restaurant.
 * Run: node addHaldiramsFoodItems.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const Restaurant = require("./Models/restaurant");
const FoodItem = require("./Models/foodItem");
const Menu = require("./Models/menu");

const VEG_FOOD_ITEMS = [
  // Snacks & Chaat
  { name: "Samosa (2 pcs)", price: 30, description: "Golden, crispy pastry shells filled with spiced potatoes and green peas. Served hot with tangy mint chutney and tamarind sauce.", stock: 50, category: "Snacks & Chaat", img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop" },
  { name: "Raj Kachori", price: 80, description: "A grand chaat experience — crispy flour shell filled with dahi, aloo, chickpeas, sev, and a medley of sweet-spicy chutneys.", stock: 30, category: "Snacks & Chaat", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop" },
  { name: "Bhel Puri", price: 60, description: "Light and tangy puffed rice tossed with chopped onions, tomatoes, coriander, and a zingy tamarind dressing. A Mumbai street food classic.", stock: 40, category: "Snacks & Chaat", img: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&auto=format&fit=crop" },
  { name: "Aloo Tikki Chaat", price: 70, description: "Pan-fried potato patties topped with whisked yogurt, green chutney, tamarind sauce and crispy sev. Irresistibly delicious!", stock: 35, category: "Snacks & Chaat", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&auto=format&fit=crop" },
  { name: "Papdi Chaat", price: 65, description: "Crispy wafers layered with boiled potatoes, chickpeas, tangy chutneys, and a generous drizzle of chilled dahi.", stock: 40, category: "Snacks & Chaat", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop" },

  // Main Course
  { name: "Dal Makhani", price: 180, description: "Rich, slow-cooked black lentils simmered overnight with tomato, butter and aromatic spices. The ultimate North Indian comfort food.", stock: 25, category: "Main Course", img: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&auto=format&fit=crop" },
  { name: "Paneer Butter Masala", price: 220, description: "Velvety smooth tomato-cream gravy enveloping soft cottage cheese cubes, elevated with hand-pounded spices and a touch of Kashmiri chilli.", stock: 25, category: "Main Course", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop" },
  { name: "Chole Bhature", price: 120, description: "Spicy, aromatic chickpeas served with pillowy-soft bhature. A legendary North Indian breakfast that satisfies like no other.", stock: 30, category: "Main Course", img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop" },
  { name: "Kadai Paneer", price: 230, description: "Paneer and bell peppers cooked in a vibrant, freshly ground spice blend with tomatoes and onions. Bold flavors, restaurant-style finish.", stock: 20, category: "Main Course", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop" },
  { name: "Pindi Chole", price: 160, description: "Dry, deeply spiced Amritsari chickpeas with a rich dark gravy. Pairs beautifully with kulcha or poori.", stock: 25, category: "Main Course", img: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&auto=format&fit=crop" },

  // Breads & Rice
  { name: "Butter Naan", price: 40, description: "Soft, leavened Indian flatbread baked in a tandoor and brushed with melted butter. The perfect accompaniment to any curry.", stock: 60, category: "Breads & Rice", img: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&auto=format&fit=crop" },
  { name: "Laccha Paratha", price: 45, description: "Multi-layered, flaky whole-wheat flatbread pan-toasted with ghee. Each bite reveals delicate, melt-in-your-mouth layers.", stock: 50, category: "Breads & Rice", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop" },
  { name: "Steamed Basmati Rice", price: 80, description: "Long-grain, aromatic basmati rice steamed to perfection. Fluffy, fragrant, and the ideal base for any North Indian gravy.", stock: 40, category: "Breads & Rice", img: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&auto=format&fit=crop" },

  // Sweets (Mithai)
  { name: "Kaju Katli (250g)", price: 280, description: "Premium cashew fudge made with the finest kaju, delicately sweetened and rolled into thin, diamond-shaped pieces. A timeless Indian classic.", stock: 20, category: "Sweets & Mithai", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop" },
  { name: "Gulab Jamun (6 pcs)", price: 90, description: "Soft milk-solid dumplings deep-fried to a golden hue and soaked in rose-cardamom sugar syrup. Served warm for maximum indulgence.", stock: 35, category: "Sweets & Mithai", img: "https://images.unsplash.com/photo-1610507798765-17c88adfae4f?w=400&auto=format&fit=crop" },
  { name: "Soan Papdi (200g)", price: 150, description: "Gossamer-thin, flaky threads of sugar and chickpea flour, laced with cardamom and pistachio. India's most beloved festive sweet.", stock: 25, category: "Sweets & Mithai", img: "https://images.unsplash.com/photo-1627307238021-37a6fde47f07?w=400&auto=format&fit=crop" },
  { name: "Rasgulla (6 pcs)", price: 80, description: "Light, spongy Bengal-style chenna balls soaked in a perfectly balanced sugar syrup. Soft, moist, and utterly irresistible.", stock: 30, category: "Sweets & Mithai", img: "https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=400&auto=format&fit=crop" },
  { name: "Motichoor Ladoo (6 pcs)", price: 120, description: "Tiny, melt-in-your-mouth besan boondi spheres bound together with saffron sugar syrup and garnished with pistachios.", stock: 25, category: "Sweets & Mithai", img: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&auto=format&fit=crop" },

  // Beverages
  { name: "Mango Lassi", price: 70, description: "Thick, creamy yogurt blended with ripe Alphonso mango pulp, a pinch of cardamom and a swirl of saffron. Refreshing and satisfying.", stock: 30, category: "Beverages", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop" },
  { name: "Rose Sharbat", price: 55, description: "Chilled, vibrant rose-flavored drink made with real rose syrup, basil seeds, and chilled milk. A classic Indian summer cooler.", stock: 35, category: "Beverages", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop" },
  { name: "Masala Chai", price: 40, description: "Fragrant, spiced tea brewed with ginger, cardamom, cinnamon and cloves, balanced with full-cream milk and jaggery.", stock: 50, category: "Beverages", img: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&auto=format&fit=crop" },
];

async function addFoodItems() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected!");

    const restaurant = await Restaurant.findOne({ name: /haldiram/i });
    if (!restaurant) {
      console.error("Haldiram's not found!");
      process.exit(1);
    }
    console.log("Found Haldiram's:", restaurant._id.toString());
    console.log("Reviews:", restaurant.reviews ? restaurant.reviews.length : 0);

    // Check existing food items
    const existingCount = await FoodItem.countDocuments({ restaurant: restaurant._id });
    if (existingCount > 0) {
      console.log(`Already has ${existingCount} food items. Skipping food item creation.`);
    } else {
      // Group items by category
      const categoryMap = {};
      VEG_FOOD_ITEMS.forEach(item => {
        if (!categoryMap[item.category]) categoryMap[item.category] = [];
        categoryMap[item.category].push(item);
      });

      // Delete existing menu for this restaurant
      await Menu.deleteMany({ restaurant: restaurant._id });

      const menuCategories = [];
      for (const [category, items] of Object.entries(categoryMap)) {
        const foodItemIds = [];
        for (const item of items) {
          const foodItem = await FoodItem.create({
            name: item.name,
            price: item.price,
            description: item.description,
            stock: item.stock,
            ratings: (Math.random() * 1 + 4).toFixed(1),
            restaurant: restaurant._id,
            images: [{ public_id: "haldirams_" + item.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""), url: item.img }],
          });
          foodItemIds.push(foodItem._id);
          console.log("  Created:", item.name);
        }
        menuCategories.push({ category, items: foodItemIds });
      }

      const menu = await Menu.create({ restaurant: restaurant._id, menu: menuCategories });
      console.log("Menu created:", menu._id.toString());
    }

    // Ensure isVeg is true
    if (!restaurant.isVeg) {
      restaurant.isVeg = true;
      await restaurant.save();
      console.log("Updated isVeg to true");
    }

    const finalCount = await FoodItem.countDocuments({ restaurant: restaurant._id });
    console.log("\nDone!");
    console.log("Restaurant:", restaurant.name, "(ID:", restaurant._id.toString() + ")");
    console.log("Food items:", finalCount);
    console.log("URL: http://localhost:5173/eats/stores/" + restaurant._id.toString() + "/menus");
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

addFoodItems();
