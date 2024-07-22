const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    prix: { type: Number, required: true },
    quantity: { type: Number, required: true },

  });
const receipsSchema = new mongoose.Schema({
  Date: {
    type: Date,
    required: true,
  },
  magasin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Magasin",
    required: true,
  },
  services: [
    { type: serviceSchema, required: true },
  ],
  custom: {
    type: Number,
    required: true,
  },
});

const receip = mongoose.model("receip", receipsSchema);

module.exports = receip;
