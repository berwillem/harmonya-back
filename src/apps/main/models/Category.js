const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "SousCategory" }],
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
