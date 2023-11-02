const mongoose = require("mongoose");

const subscriptionRequestSchema = new mongoose.Schema({
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
  request: {
    type: String,
    enum: ["new", "renew"],
  },
});

const SubscriptionRequest = mongoose.model(
  "SubscriptionRequest",
  subscriptionRequestSchema
);

module.exports = SubscriptionRequest;
