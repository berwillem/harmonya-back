const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NewsletterEmail = mongoose.model("Email", emailSchema);

module.exports = NewsletterEmail;
