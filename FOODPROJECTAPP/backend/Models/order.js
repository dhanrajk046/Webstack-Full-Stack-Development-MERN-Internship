// 🎯 STEP 1: START WITH REAL-LIFE STORY
// (Teaching comments preserved)

const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  deliveryInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      fooditem: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "FoodItem",
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  paidAt: {
    type: Date,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    default: 0.0,
  },
  deliveryCharge: {
    type: Number,
    default: 0.0,
  },
  finalTotal: {
    type: Number,
    required: true,
    default: 0.0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  deliveredAt: {
    type: Date,
  },
  cancelledAt: {
    type: Date,
  },
  cancelledReason: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// 🚀 STEP 3 & 4: PRE-SAVE LOGIC (FIXED)

// Notice we removed `next` from the parameters and the try/catch block.
// Mongoose handles promises (async/await) automatically!
orderSchema.pre("save", async function () {
  if (!this.isNew) return;
  for (const orderItem of this.orderItems) {
    const foodItem = await mongoose
      .model("FoodItem")
      .findById(orderItem.fooditem);

    if (!foodItem) {
      // Throwing an error automatically stops the save process in modern Mongoose
      throw new Error("Food item not found.");
    }

    if (foodItem.stock < orderItem.quantity) {
      throw new Error(
        `Insufficient stock for '${orderItem.name}' in this order.`
      );
    }

    foodItem.stock -= orderItem.quantity;
    await foodItem.save();
  }
});

module.exports = mongoose.model("Order", orderSchema);