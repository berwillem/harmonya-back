const mongoose = require("mongoose");

const bookingRequestSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: false,
  },

  date: {
    type: Date,
    required: false,
  },

  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },

  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },

  confirmed: {
    type: Boolean,
    default: false,
  },
});

const BookingRequest = mongoose.model("BookingRequest", bookingRequestSchema);

module.exports = BookingRequest;
