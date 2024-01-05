const mongoose = require("mongoose");

const boostSchema = new mongoose.Schema({
  boostType: {
    type: String,
    enum: ["standard", "mega"],
    required: true,
  },
  expiryDate: {
    type: Date,
    expires: 24*60*60,
    default: Date.now,
  },
  magasin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Magasin",
  }
});

const Boost = mongoose.model("boost", boostSchema);


module.exports = Boost;
