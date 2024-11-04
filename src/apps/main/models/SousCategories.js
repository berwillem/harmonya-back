const mongoose = require("mongoose");

const sousCategorySchema = new mongoose.Schema({
  sousCateogoryName: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

const SousCategory = mongoose.model("SousCategory", sousCategorySchema);

module.exports = SousCategory;
