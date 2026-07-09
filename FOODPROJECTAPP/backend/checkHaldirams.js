const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const Restaurant = require('./Models/restaurant');
const FoodItem = require('./Models/foodItem');

async function check() {
  await mongoose.connect(process.env.DB_URL);
  const r = await Restaurant.findOne({ name: /haldiram/i });
  if (r) {
    console.log('Name:', r.name);
    console.log('isVeg:', r.isVeg);
    console.log('Reviews count:', r.reviews ? r.reviews.length : 0);
    console.log('numOfReviews:', r.numOfReviews);
    const items = await FoodItem.find({ restaurant: r._id }).limit(5);
    console.log('Food items:', items.map(i => i.name).join(', '));
    const total = await FoodItem.countDocuments({ restaurant: r._id });
    console.log('Total food items:', total);
  } else {
    console.log('Not found!');
  }
  await mongoose.disconnect();
  process.exit(0);
}
check().catch(e => { console.error(e.message); process.exit(1); });
