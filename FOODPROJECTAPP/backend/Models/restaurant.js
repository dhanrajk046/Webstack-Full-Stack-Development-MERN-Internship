const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    // Add your actual database fields here based on your project requirements
    name: {
        type: String,
        required: [true, 'Please enter a restaurant name'],
        trim: true
    },
    // Example fields:
    // location: { type: String },
    // cuisine: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);