const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  prix: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  magasin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Magasin",
    required: true,
  },
  time: {
    type: Number,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  souscategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SousCategory",
    // required: true,
  },
  cible: {
    type: String,
    enum: ["men", "women", "both"],
    required: true,
  },
  stores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
  ],
  images: [
    {
      type: String,
    },
  ],
  color: {
    type: String,
    required: true,
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
