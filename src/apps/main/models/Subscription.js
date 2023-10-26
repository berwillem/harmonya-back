const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  magasin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Magasin",
    required: true,
  },
  type: {
    type: String,
    enum: ["standard", "premium", "gold"],
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  dates: {
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
  },
  paid: {
    type: Boolean,
    default: false,
  },
  trial: {
    type: Boolean,
    default: false,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
