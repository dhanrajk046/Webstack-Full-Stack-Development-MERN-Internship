const mongoose = require("mongoose");
const Menu = require("../Models/menu");
const FoodItem = require("../Models/foodItem");
const Restaurant = require("../Models/restaurant");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("../Middlewares/catchAsyncErrors");

// ==========================================
// GET ALL MENUS
// ==========================================
exports.getAllMenus = catchAsync(async (req, res, next) => {
  const restaurantId = req.params.storeId;

  if (!restaurantId) {
    return next(new ErrorHandler("Restaurant ID is required", 400));
  }

  // Helper to normalize strings for regex search
  const normalize = (text) =>
    text
      .replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&")
      .replace(/['’]/g, "")
      .trim();

  const buildPayloadFromFoodItems = (foodItems) => [
    {
      _id: `restaurant-${restaurantId}`,
      category: "All Items",
      items: foodItems,
    },
  ];

  const buildPayloadFromMenuDocs = (menuDocs) => {
    if (!Array.isArray(menuDocs) || menuDocs.length === 0) return [];

    const hasStructuredMenu = menuDocs.some(
      (doc) => Array.isArray(doc.menu) && doc.menu.length > 0,
    );

    if (hasStructuredMenu) {
      return menuDocs.flatMap((doc) =>
        Array.isArray(doc.menu) ? doc.menu : [],
      );
    }

    return [
      {
        _id: `restaurant-${restaurantId}`,
        category: "All Items",
        items: menuDocs,
      },
    ];
  };

  let menuPayload = [];
  
  // NOTE: Added 'new' before mongoose.Types.ObjectId to prevent crashes
  const restaurantObjectId = mongoose.Types.ObjectId.isValid(restaurantId)
    ? new mongoose.Types.ObjectId(restaurantId) 
    : null;

  const restaurantQuery = restaurantObjectId
    ? { restaurant: { $in: [restaurantId, restaurantObjectId] } }
    : { restaurant: restaurantId };

  // 1. Try finding a structured Menu document first
  let menuDocs = await Menu.find(restaurantQuery).populate("menu.items");

  if (menuDocs && menuDocs.length > 0) {
    menuPayload = buildPayloadFromMenuDocs(menuDocs);
  } else {
    // 2. Fall back to raw list of food items
    let foodItems = await FoodItem.find(restaurantQuery).populate("restaurant", "-reviews");

    if (foodItems && foodItems.length > 0) {
      menuPayload = buildPayloadFromFoodItems(foodItems);
    }

    if (menuPayload.length === 0) {
      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant) {
        const cleanedName = normalize(restaurant.name);
        const terms = Array.from(
          new Set(cleanedName.split(/\s+/).filter((term) => term.length >= 3)),
        );

        const regexes = terms.map((term) => new RegExp(term, "i"));
        const orClauses = [
          { name: new RegExp(cleanedName, "i") },
          { description: new RegExp(cleanedName, "i") },
          ...regexes.map((regex) => ({ name: regex })),
          ...regexes.map((regex) => ({ description: regex })),
        ];

        menuDocs = await Menu.find({ $or: orClauses }).populate("menu.items");
        if (menuDocs && menuDocs.length > 0) {
          menuPayload = buildPayloadFromMenuDocs(menuDocs);
        } else {
          foodItems = await FoodItem.find({ $or: orClauses }).populate("restaurant", "-reviews");
          if (foodItems && foodItems.length > 0) {
            menuPayload = buildPayloadFromFoodItems(foodItems);
          }
        }
      }
    }
  }

  res.status(200).json({
    status: "success",
    count: menuPayload.length,
    data: menuPayload,
  });
});

// ==========================================
// CREATE MENU
// ==========================================
exports.createMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.create(req.body);

  res.status(201).json({
    status: "success",
    data: menu,
  });
});

// ==========================================
// DELETE MENU
// ==========================================
exports.deleteMenu = catchAsync(async (req, res, next) => {
  const menu = await Menu.findByIdAndDelete(req.params.menuId);

  if (!menu) {
    return next(new ErrorHandler("No document found with that ID", 404));
  }

  // 204 status means "No Content" (successful deletion)
  res.status(204).json({
    status: "success",
  });
});

// ==========================================
// ADD ITEM TO MENU
// ==========================================
exports.addItemToMenu = catchAsync(async (req, res, next) => {
  const { category, foodItemId } = req.body;
  const menuId = req.params.menuId;

  if (!menuId) {
    return next(new ErrorHandler("Menu ID is required", 400));
  }

  const menu = await Menu.findById(menuId);

  if (!menu) {
    return next(new ErrorHandler("Menu not found", 404));
  }

  // Find category inside the menu array
  let cat = menu.menu.find((c) => c.category === category);

  // If the category doesn't exist yet, create it
  if (!cat) {
    cat = { category, items: [] };
    menu.menu.push(cat);
  }

  // Push the new food item reference into the items array
  cat.items.push(foodItemId);

  // Save the parent document
  await menu.save();

  // Populate the items before sending the response back
  await menu.populate("menu.items");

  res.status(200).json({
    status: "success",
    data: menu,
  });
});

// ==========================================
// ADD NEW ITEM AND CATEGORY (MANAGE MENU)
// ==========================================
exports.addItemAndCategory = catchAsync(async (req, res, next) => {
  const { restaurantId, category, name, price, description, stock, image } = req.body;

  if (!restaurantId || !category || !name || !price || !description || !stock) {
    return next(new ErrorHandler("Please fill out all fields", 400));
  }

  // 1. Create the food item
  const foodItem = await FoodItem.create({
    name,
    price: Number(price),
    description,
    stock: Number(stock),
    restaurant: restaurantId,
    images: [{
      public_id: `custom_${Date.now()}`,
      url: image || "https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&auto=format&fit=crop"
    }]
  });

  // 2. Find or create the Menu document for the restaurant
  let menu = await Menu.findOne({ restaurant: restaurantId });
  if (!menu) {
    menu = await Menu.create({
      restaurant: restaurantId,
      menu: []
    });
  }

  // 3. Find or create the category in the menu
  let cat = menu.menu.find(
    (c) => c.category.toLowerCase().trim() === category.toLowerCase().trim()
  );

  if (!cat) {
    cat = { category: category.trim(), items: [] };
    menu.menu.push(cat);
  }

  // 4. Add the food item reference
  cat.items.push(foodItem._id);
  menu.markModified("menu");
  await menu.save();

  res.status(201).json({
    status: "success",
    message: "Item added successfully to category!",
    foodItem,
    menu,
  });
});