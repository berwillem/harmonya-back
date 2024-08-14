const express = require("express");
const router = express.Router();
const { dynamicImageUpload } = require("../../../middlewares/imageUpload");
const {
  createOrUpdatePubManagment,
  getAllPubManagment,
  createOrUpdatePubManagmentMobil,
  getAllPubManagmentMobil,
} = require("../controllers/PubManagmentController");

router.post("/", dynamicImageUpload, createOrUpdatePubManagment);
router.post("/mobile", dynamicImageUpload, createOrUpdatePubManagmentMobil)

router.get("/", getAllPubManagment);
router.get("/mobile", getAllPubManagmentMobil)
module.exports = router;
