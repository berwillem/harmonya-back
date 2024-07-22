const express = require("express");
const router = express.Router();
const { imageUpload, dynamicImageUpload } = require("../../../middlewares/imageUpload");
const {
  createOrUpdatePubManagment,
  getAllPubManagment,
} = require("../controllers/PubManagmentController");

router.post("/", dynamicImageUpload, createOrUpdatePubManagment);
router.get("/", getAllPubManagment);
module.exports = router;
