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
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
