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
  subscriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
  ],
  subscriptionRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubscriptionRequest",
  },
  trial: {
    type: Boolean,
    default: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
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
    bookmarks: {
      type: Number,
      default: 0,
    },
  },
  infos: {
    name: String,
    address: String,
    email: String,
    number: String,
    description: String,
  },
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "BoostRequest" }],

  score: {
    type: Number,
    default: 0,
  },

  activeBoost: {
    boost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boost",
      default: null,
    },
    boostType: {
      type: String,
      enum: ["mega", "standard", null],
    },
  },

  visits: {
    auth: [
      {
        year: {
          type: Number,
          default: new Date().getFullYear,
        },
        days: {
          type: Array,
          default: () => {
            if (new Date().getFullYear() % 4 === 0) {
              return Array(366).fill(0)
            }else{
              return Array(365).fill(0)
            }
          },
        },
      },
    ],
    noAuth: {
      type: Number,
      default: 0,
    },
    userList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
});

const Magasin = mongoose.model("Magasin", magasinSchema);

module.exports = Magasin;
