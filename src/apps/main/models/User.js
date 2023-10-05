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
  // phone: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   trim: true,
  // },
  // birthdate: {
  //   type: Date,
  //   required: true,
  // },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
