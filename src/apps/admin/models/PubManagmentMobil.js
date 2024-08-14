const mongoose = require("mongoose");

const PubManagmentMobilSchema = new mongoose.Schema({
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

const PubManagmentMobil = mongoose.model(
  "PubManagmentMobil",
  PubManagmentMobilSchema
);

module.exports = PubManagmentMobil;
