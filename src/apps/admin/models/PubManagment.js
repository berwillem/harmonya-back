const mongoose = require("mongoose");

const PubManagmentSchema = new mongoose.Schema({
  slides: [
    {
      images: { type: String },
      titre_principale: {
        type: String,
        required: true,
      },
      titre_secondaire: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
    },
  ],
});

const PubManagment = mongoose.model("PubManagment", PubManagmentSchema);

module.exports = PubManagment;
