const express = require("express");
const router = express.Router();
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/CategoryController");

// Get all categories
router.get("/", getCategories);

// Add a new category
router.post("/", addCategory);

// Update a category by ID
router.put("/:id", updateCategory);

// Delete a category by ID
router.delete("/:id", deleteCategory);

module.exports = router;
