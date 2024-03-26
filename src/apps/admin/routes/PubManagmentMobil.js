const express = require("express");
const router = express.Router();
const { imageUpload } = require("../../../middlewares/imageUpload");
const {
  createOrUpdatePubManagmentMobil,
  getAllPubManagmentMobil,
} = require("../controllers/PubManagmentMobilController");

router.post("/", imageUpload, createOrUpdatePubManagmentMobil);
router.get("/", getAllPubManagmentMobil);
module.exports = router;
