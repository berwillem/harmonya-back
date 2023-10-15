const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
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
    default: "User",
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  birthdate: {
    type: Date,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
