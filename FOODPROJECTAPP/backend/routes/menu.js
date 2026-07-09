

const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAllMenus,
  createMenu,
  deleteMenu,
  addItemToMenu,
  addItemAndCategory,
} = require("../controllers/menuController");

const { protect } = require("../controllers/authController");

router.route("/manage/addItem").post(protect, addItemAndCategory);

router
  .route("/")
  .get(getAllMenus)
  .post(protect, createMenu);

// add food item to a specific menu (more specific, must come before /:menuId)
router
  .route("/:menuId/addItem")
  .patch(protect, addItemToMenu);

router.route("/:menuId").delete(protect, deleteMenu);

module.exports = router;
