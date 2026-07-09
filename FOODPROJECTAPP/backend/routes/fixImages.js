const express = require("express");
const router = express.Router();
const FoodItem = require("../Models/foodItem");
const Restaurant = require("../Models/restaurant");

router.get("/fix-haldiram", async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ name: /haldiram/i });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Haldiram not found" });
    }

    const items = await FoodItem.find({ restaurant: restaurant._id });
    
    for (let item of items) {
      const prompt = `${item.name} authentic Indian food delicious professional food photography 4k`;
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=400&nologo=true`;
      
      item.images = [{
        public_id: `haldirams_dyn_${item._id}`,
        url: url
      }];
      await item.save();
    }

    res.json({ success: true, message: `Updated ${items.length} items!`, items: items.map(i => i.name) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
