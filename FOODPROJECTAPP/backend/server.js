// server.js
const path = require("path");
const app = require("./app");
const connectDatabase = require("./config/database");
const dotenv = require("dotenv");

// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

// Setting up config file
dotenv.config({ path: path.join(__dirname, "config", "config.env") });

// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`,
  );
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise rejection");

  server.close(() => {
    process.exit(1);
  });
});

// Auto-update images for Haldiram
const FoodItem = require("./Models/foodItem");
const Restaurant = require("./Models/restaurant");
setTimeout(async () => {
  try {
    const items = await FoodItem.find({});
    let updated = 0;
    for (let item of items) {
      if (!item.images || !item.images[0] || !item.images[0].url || !item.images[0].url.includes("pollinations")) {
        // More generic prompt for all cuisines
        const prompt = `${item.name} delicious food professional food photography 4k`;
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=400&nologo=true`;
        
        item.images = [{
          public_id: `dyn_${item._id}`,
          url: url
        }];
        await item.save();
        updated++;
      }
    }
    if (updated > 0) {
      console.log(`Updated ${updated} food items across all restaurants with new AI images!`);
    }
  } catch (err) {
    console.error("Global image update failed:", err);
  }
}, 3000);
