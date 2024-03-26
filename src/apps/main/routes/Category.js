const express = require("express");
const router = express.Router();
const {
  getCategories,
  addCategory,
  deleteCategory,
} = require("../controllers/CategoryController");

// Get all categories
router.get("/", getCategories);

// Add a new category
router.post("/", addCategory);

// Delete a category by ID
router.delete("/:id", deleteCategory);

module.exports = router;
