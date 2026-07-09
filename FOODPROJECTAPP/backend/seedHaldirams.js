/**
 * Haldiram's Sample Data Seeder
 * 
 * Seeds Haldiram's restaurant with veg food items, menus, and reviews.
 * Run from backend directory: node seedHaldirams.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment config
dotenv.config({ path: "./config/config.env" });

const Restaurant = require("./Models/restaurant");
const FoodItem = require("./Models/foodItem");
const Menu = require("./Models/menu");

const HALDIRAMS_DATA = {
  restaurant: {
    name: "Haldiram's",
    isVeg: true,
    address: "12, Connaught Place, New Delhi – 110001",
    ratings: 4.4,
    numOfReviews: 8,
    images: [
      {
        public_id: "haldirams_main",
        url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop"
      }
    ],
    reviews: [
      { name: "Priya Sharma", rating: 5, Comment: "Amazing sweets and snacks! The soan papdi is absolutely divine. Love the authentic Indian flavors here. Will definitely visit again!" },
      { name: "Rahul Gupta", rating: 4, Comment: "Good quality food at reasonable prices. The samosas are perfectly crispy and the chutneys are excellent. A little crowded on weekends." },
      { name: "Anita Verma", rating: 5, Comment: "Best mithai shop in Delhi! The kaju katli melts in your mouth. Packaging is clean and hygienic. Great for gifting too." },
      { name: "Vikram Singh", rating: 4, Comment: "Haldiram's never disappoints. Dal makhani and paneer butter masala are restaurant-level quality. Service could be faster." },
      { name: "Sunita Patel", rating: 4, Comment: "Loved the Raj Kachori and bhel puri. Fresh ingredients, nice ambiance. Slightly overpriced but worth it for the quality." },
      { name: "Mohan Das", rating: 5, Comment: "Authentic North Indian flavors! The chole bhature are outstanding. Best breakfast spot in the area without a doubt." },
      { name: "Deepika Nair", rating: 3, Comment: "Food is tasty but the service was slow during lunch rush. The gulab jamun is excellent though. Need better staff management." },
      { name: "Arjun Mehta", rating: 5, Comment: "Outstanding traditional sweets. Bought Diwali gift boxes here. Everything was fresh and beautifully packaged. Highly recommended!" }
    ]
  }
};

const VEG_FOOD_ITEMS = [
  // Snacks & Chaat
  { name: "Samosa (2 pcs)", price: 30, description: "Golden, crispy pastry shells filled with spiced potatoes and green peas. Served hot with tangy mint chutney and tamarind sauce.", stock: 50, category: "Snacks & Chaat" },
  { name: "Raj Kachori", price: 80, description: "A grand chaat experience — crispy flour shell filled with dahi, aloo, chickpeas, sev, and a medley of sweet-spicy chutneys.", stock: 30, category: "Snacks & Chaat" },
  { name: "Bhel Puri", price: 60, description: "Light and tangy puffed rice tossed with chopped onions, tomatoes, coriander, and a zingy tamarind dressing. A Mumbai street food classic.", stock: 40, category: "Snacks & Chaat" },
  { name: "Aloo Tikki Chaat", price: 70, description: "Pan-fried potato patties topped with whisked yogurt, green chutney, tamarind sauce and crispy sev. Irresistibly delicious!", stock: 35, category: "Snacks & Chaat" },
  { name: "Papdi Chaat", price: 65, description: "Crispy wafers layered with boiled potatoes, chickpeas, tangy chutneys, and a generous drizzle of chilled dahi.", stock: 40, category: "Snacks & Chaat" },

  // Main Course
  { name: "Dal Makhani", price: 180, description: "Rich, slow-cooked black lentils simmered overnight with tomato, butter and aromatic spices. The ultimate North Indian comfort food.", stock: 25, category: "Main Course" },
  { name: "Paneer Butter Masala", price: 220, description: "Velvety smooth tomato-cream gravy enveloping soft cottage cheese cubes, elevated with hand-pounded spices and a touch of Kashmiri chilli.", stock: 25, category: "Main Course" },
  { name: "Chole Bhature", price: 120, description: "Spicy, aromatic chickpeas served with pillowy-soft bhature. A legendary North Indian breakfast that satisfies like no other.", stock: 30, category: "Main Course" },
  { name: "Kadai Paneer", price: 230, description: "Paneer and bell peppers cooked in a vibrant, freshly ground spice blend with tomatoes and onions. Bold flavors, restaurant-style finish.", stock: 20, category: "Main Course" },
  { name: "Pindi Chole", price: 160, description: "Dry, deeply spiced Amritsari chickpeas with a rich dark gravy. Pairs beautifully with kulcha or poori.", stock: 25, category: "Main Course" },

  // Breads
  { name: "Butter Naan", price: 40, description: "Soft, leavened Indian flatbread baked in a tandoor and brushed with melted butter. The perfect accompaniment to any curry.", stock: 60, category: "Breads & Rice" },
  { name: "Laccha Paratha", price: 45, description: "Multi-layered, flaky whole-wheat flatbread pan-toasted with ghee. Each bite reveals delicate, melt-in-your-mouth layers.", stock: 50, category: "Breads & Rice" },
  { name: "Steamed Basmati Rice", price: 80, description: "Long-grain, aromatic basmati rice steamed to perfection. Fluffy, fragrant, and the ideal base for any North Indian gravy.", stock: 40, category: "Breads & Rice" },

  // Sweets (Mithai)
  { name: "Kaju Katli (250g)", price: 280, description: "Premium cashew fudge made with the finest kaju, delicately sweetened and rolled into thin, diamond-shaped pieces. A timeless Indian classic.", stock: 20, category: "Sweets & Mithai" },
  { name: "Gulab Jamun (6 pcs)", price: 90, description: "Soft milk-solid dumplings deep-fried to a golden hue and soaked in rose-cardamom sugar syrup. Served warm for maximum indulgence.", stock: 35, category: "Sweets & Mithai" },
  { name: "Soan Papdi (200g)", price: 150, description: "Gossamer-thin, flaky threads of sugar and chickpea flour, laced with cardamom and pistachio. India's most beloved festive sweet.", stock: 25, category: "Sweets & Mithai" },
  { name: "Rasgulla (6 pcs)", price: 80, description: "Light, spongy Bengal-style chenna balls soaked in a perfectly balanced sugar syrup. Soft, moist, and utterly irresistible.", stock: 30, category: "Sweets & Mithai" },
  { name: "Motichoor Ladoo (6 pcs)", price: 120, description: "Tiny, melt-in-your-mouth besan boondi spheres bound together with saffron sugar syrup and garnished with pistachios.", stock: 25, category: "Sweets & Mithai" },

  // Beverages
  { name: "Mango Lassi", price: 70, description: "Thick, creamy yogurt blended with ripe Alphonso mango pulp, a pinch of cardamom and a swirl of saffron. Refreshing and satisfying.", stock: 30, category: "Beverages" },
  { name: "Rose Sharbat", price: 55, description: "Chilled, vibrant rose-flavored drink made with real rose syrup, basil seeds, and chilled milk. A classic Indian summer cooler.", stock: 35, category: "Beverages" },
  { name: "Masala Chai", price: 40, description: "Fragrant, spiced tea brewed with ginger, cardamom, cinnamon and cloves, balanced with full-cream milk and jaggery.", stock: 50, category: "Beverages" },
];

const IMAGE_MAP = {
  "Snacks & Chaat": [
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop",
  ],
  "Main Course": [
    "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&auto=format&fit=crop",
  ],
  "Breads & Rice": [
    "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&auto=format&fit=crop",
  ],
  "Sweets & Mithai": [
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1610507798765-17c88adfae4f?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1627307238021-37a6fde47f07?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&auto=format&fit=crop",
  ],
  "Beverages": [
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&auto=format&fit=crop",
  ],
};

async function seedHaldirams() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Connected to MongoDB");

    // --- Check if Haldiram's already exists ---
    const existing = await Restaurant.findOne({ name: /haldiram/i });
    if (existing) {
      console.log(`⚠️  Haldiram's already exists (ID: ${existing._id})`);
      console.log("   To re-seed, delete the existing restaurant first.");
      console.log("   Updating reviews only...");

      // Update reviews if missing
      if (!existing.reviews || existing.reviews.length === 0) {
        existing.reviews = HALDIRAMS_DATA.restaurant.reviews;
        existing.numOfReviews = HALDIRAMS_DATA.restaurant.reviews.length;
        existing.ratings = 4.4;
        await existing.save();
        console.log("✅ Reviews added to existing Haldiram's restaurant.");
      }
      await mongoose.disconnect();
      return;
    }

    // --- Create Restaurant ---
    console.log("🏪 Creating Haldiram's restaurant...");
    const restaurant = await Restaurant.create(HALDIRAMS_DATA.restaurant);
    console.log(`✅ Restaurant created: ${restaurant._id}`);

    // --- Group items by category ---
    const categoryMap = {};
    VEG_FOOD_ITEMS.forEach(item => {
      if (!categoryMap[item.category]) categoryMap[item.category] = [];
      categoryMap[item.category].push(item);
    });

    // --- Create FoodItems & Menu ---
    console.log("🍱 Creating food items and menu...");
    const menuCategories = [];

    let catIndexMap = {};
    Object.keys(IMAGE_MAP).forEach(cat => { catIndexMap[cat] = 0; });

    for (const [category, items] of Object.entries(categoryMap)) {
      const foodItemIds = [];
      const images = IMAGE_MAP[category] || [];

      for (const item of items) {
        // Generate high-quality, relevant images for each item dynamically
        const prompt = `${item.name} authentic Indian food delicious professional food photography 4k`;
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=400&nologo=true`;

        const foodItem = await FoodItem.create({
          name: item.name,
          price: item.price,
          description: item.description,
          stock: item.stock,
          ratings: Math.random() * 1 + 4, // 4.0–5.0
          restaurant: restaurant._id,
          images: [{ public_id: `haldirams_dyn_${item.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")}`, url: imageUrl }],
        });

        foodItemIds.push(foodItem._id);
        console.log(`  ✓ ${item.name} created`);
      }

      menuCategories.push({ category, items: foodItemIds });
    }

    // --- Create Menu document ---
    const menu = await Menu.create({
      restaurant: restaurant._id,
      menu: menuCategories,
    });
    console.log(`✅ Menu created with ${VEG_FOOD_ITEMS.length} items across ${menuCategories.length} categories`);

    console.log("\n🎉 Haldiram's seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`  Restaurant ID : ${restaurant._id}`);
    console.log(`  Menu ID       : ${menu._id}`);
    console.log(`  Food Items    : ${VEG_FOOD_ITEMS.length}`);
    console.log(`  Reviews       : ${HALDIRAMS_DATA.restaurant.reviews.length}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`\n  👉 Visit: http://localhost:5173/eats/stores/${restaurant._id}/menus`);

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

seedHaldirams();
