const express = require("express");
const router = express.Router();
const {
  getCategories,
  addCategory,
  deleteCategory,
  getSousCategories,
  addSousCategory,
  deleteSousCategory,
} = require("../controllers/CategoryController");

// Category Routes

// Get all categories
router.get("/", getCategories);

// Add a new category
router.post("/", addCategory);

// Delete a category by ID
router.delete("/:id", deleteCategory);

// SousCategory Routes

// Get all subcategories
router.get("/subcategories", getSousCategories);

// Add a new subcategory
router.post("/subcategories", addSousCategory);

// Delete a subcategory by ID
router.delete("/subcategories/:id", deleteSousCategory);

module.exports = router;
