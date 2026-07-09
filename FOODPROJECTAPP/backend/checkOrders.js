const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const Order = require('./Models/order');

async function run() {
  await mongoose.connect(process.env.DB_URL);
  const count = await Order.countDocuments({});
  console.log('Total orders in DB:', count);
  const orders = await Order.find({}).limit(3).populate('user restaurant');
  console.log('Sample orders:', JSON.stringify(orders, null, 2));
  await mongoose.disconnect();
}
run().catch(console.error);
