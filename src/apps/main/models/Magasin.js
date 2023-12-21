const mongoose = require("mongoose");

const magasinSchema = new mongoose.Schema({
  magasinName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    default: "Magasin",
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  ],
  stores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Store" }],
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
  },
  subscriptionRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubscriptionRequest",
  },
  data: {
    visits: {
      timestamps: [
        {
          visitorId: String,
          timestamp: Date,
        },
      ],
    },
  },
});

const Magasin = mongoose.model("Magasin", magasinSchema);

module.exports = Magasin;
