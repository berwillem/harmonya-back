const Category = require("../models/Category");

exports.getCategories = (req, res) => {
  Category.find({}).then((categories) => {
    res.send(categories);
  });
};

exports.addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    existing_cat = await Category.findOne({ categoryName: name });
  } catch (err) {
    console.log(err);
  }

  if (existing_cat) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const cat = new Category({
    categoryName: name,
  });
  try {
    await cat.save();
    return res.status(201).json({ message: "Category created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to create category" });
  }
};
