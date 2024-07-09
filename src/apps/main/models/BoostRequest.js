const mongoose = require("mongoose");

const boostRequestSchema = new mongoose.Schema({
  boostType: {
    type: String,
    enum: ["standard", "mega"],
    required: true,
  },
  magasin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Magasin",
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  validation: {
    type: Boolean,
    default: false,
  },
  ready: {
    type: Boolean,
    default: false
  }
  
});

const BoostRequest = mongoose.model("BoostRequest", boostRequestSchema);

module.exports = BoostRequest;
