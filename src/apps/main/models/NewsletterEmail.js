const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    expires: 30*24*60*60,
    default: Date.now,
  },
});

const NewsletterEmail = mongoose.model("Email", emailSchema);

module.exports = NewsletterEmail;
