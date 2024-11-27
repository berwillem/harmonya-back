const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  wilaya: {
    type: String,
    enum: ["Alger", "Oran", "Blida", "Béjaïa"],
    required: true,
  },
  storeName: {
    type: String,
    required: [true, "Store name is required"],
    trim: true,
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Magasin",
    required: [true, "Owner ID is required"],
  },
  baseAgenda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agenda",
    required: [true, "Base Agenda ID is required"],
  },
  displayAgenda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agenda",
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\d{10,15}$/, "Phone number must be between 10 and 15 digits"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email address",
    ],
  },
  images: [
    {
      type: String,
    
    },
  ],

});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
