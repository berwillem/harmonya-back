const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  location: {
    type: String,
  },
  employees: [
    {
      nom: {
        type: String,
        required: true,
      },
      prenom: {
        type: String,
        required: true,
      },
      fonction: {
        type: String,
        required: true,
      },
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Magasin",
    required: true,
  },
});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
