const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  UserType: {
    type: String,
    enum: ["All", "User","Magasin"],
    required: true,
  },
  Message: {
    type: String,
    required: true,
  },
  timestamp:{
    type: Date,
    default: Date.now
  },
});

const Alert = mongoose.model("Alert", AlertSchema);
module.exports = Alert;
