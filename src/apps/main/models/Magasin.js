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
  tour: {
    type: Boolean,
    default: false,
  },
  completedauth: {
    type: Boolean,
    default: false,
  },
  registrationSteps: {
    profileCompleted: { type: Boolean, default: false },
    storeCreated: { type: Boolean, default: false },
    serviceCreated: { type: Boolean, default: false },
  },

  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  ],
  wilaya: [
    {
      type: String,
      enum: ["Alger", "Oran", "Blida", "Béjaïa", "Béjaïa"],
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

  data: {
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
                return Array(366).fill(0);
              } else {
                return Array(365).fill(0);
              }
            },
          },
        },
      ],
      noAuth: [
        {
          year: {
            type: Number,
            default: new Date().getFullYear,
          },
          days: {
            type: Array,
            default: () => {
              if (new Date().getFullYear() % 4 === 0) {
                return Array(366).fill(0);
              } else {
                return Array(365).fill(0);
              }
            },
          },
        },
      ],
      userList: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          lastVisit: {
            type: Date,
          },
          visits: {
            type: Number,
          },
        },
      ],
    },
    bookmarks: {
      type: Number,
      default: 0,
    },
    bookings: {
      type: Number,
      default: 0,
    },
  },
  infos: {
    numero: String,
    Desc: String,
    pdp: String,
    images: [String],
  },

  score: {
    type: Number,
    default: 0,
  },

  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "BoostRequest" }],
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
  blacklistedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
magasinSchema.methods.updateCompletedAuth = function () {
  const stepsCompleted = Object.values(this.registrationSteps).every(
    (step) => step === true
  );
  this.completedauth = stepsCompleted;
};

magasinSchema.pre("save", function (next) {
  // If there are no entries in the auth array, create one for the current year
  if (this.data.visits.auth.length === 0) {
    const currentYear = new Date().getFullYear();
    const daysArray = new Array(currentYear % 4 === 0 ? 366 : 365).fill(0);
    this.data.visits.auth.push({ year: currentYear, days: daysArray });
    this.data.visits.noAuth.push({ year: currentYear, days: daysArray });
  }
  next();
});

const Magasin = mongoose.model("Magasin", magasinSchema);

module.exports = Magasin;
