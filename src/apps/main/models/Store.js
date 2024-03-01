const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  wilaya: {
    type: String,
    enum: ["Alger", "Oran", "Blida", "Béjaïa", "Béjaïa"],
    required: true,
  },
  location: {
    type: String,
  },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Magasin",
    required: true,
  },
  baseAgenda: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Agenda",
    required:true,
  }
});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
