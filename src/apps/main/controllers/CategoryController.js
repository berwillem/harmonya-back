const Category = require("../models/Category");

// Get all categories
exports.getCategories = (req, res) => {
  Category.find({}).then((categories) => {
    res.send(categories);
  });
};

// Add a new category
exports.addCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const existingCategory = await Category.findOne({ categoryName: name });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({
      categoryName: name,
    });

    await newCategory.save();
    return res.status(201).json({ message: "Category created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create category" });
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json({
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete category" });
  }
};
