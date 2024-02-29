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
    required: true,
  },
  stores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
  ],
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
