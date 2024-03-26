const mongoose = require("mongoose");

const PubManagmentMobilSchema = new mongoose.Schema({
  images: [{ type: String }],
});

const PubManagmentMobil = mongoose.model(
  "PubManagmentMobil",
  PubManagmentMobilSchema
);

module.exports = PubManagmentMobil;
