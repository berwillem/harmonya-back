const Category = require("../models/Category");
const SousCategory = require("../models/SousCategories");

// Get all categories with subcategories populated
exports.getCategories = (req, res) => {
  Category.find({})
    .populate("children", "sousCateogoryName")
    .then((categories) => {
      res.send(categories);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch categories" });
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

// Delete a category by ID along with its associated subcategories
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Remove associated subcategories
    await SousCategory.deleteMany({ parent: id });

    return res.json({
      message: "Category and its subcategories deleted successfully",
      category: deletedCategory,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete category" });
  }
};

exports.getSousCategories = (req, res) => {
  SousCategory.find({})
    .populate("parent", "categoryName") // populate parent with categoryName
    .then((sousCategories) => {
      res.send(sousCategories);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch subcategories" });
    });
};

// Add a new subcategory
exports.addSousCategory = async (req, res) => {
  const { sousCateogoryName, parentId } = req.body;

  try {
    const parentCategory = await Category.findById(parentId);

    if (!parentCategory) {
      return res.status(404).json({ message: "Parent category not found" });
    }

    const newSousCategory = new SousCategory({
      sousCateogoryName,
      parent: parentId,
    });

    await newSousCategory.save();

    // Add the new subcategory to the parent's children array
    parentCategory.children.push(newSousCategory._id);
    await parentCategory.save();

    return res
      .status(201)
      .json({ message: "SousCategory created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create subcategory" });
  }
};

// Delete a subcategory by ID
exports.deleteSousCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSousCategory = await SousCategory.findByIdAndDelete(id);

    if (!deletedSousCategory) {
      return res.status(404).json({ message: "SousCategory not found" });
    }

    // Remove subcategory from the parent's children array
    await Category.findByIdAndUpdate(deletedSousCategory.parent, {
      $pull: { children: id },
    });

    return res.json({
      message: "SousCategory deleted successfully",
      sousCategory: deletedSousCategory,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete subcategory" });
  }
};
