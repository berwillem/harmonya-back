const express = require("express");
const router = express.Router();
const { imageUpload } = require("../../../middlewares/imageUpload");
const {
  createOrUpdatePubManagment,
  getAllPubManagment,
} = require("../controllers/PubManagmentController");

router.post("/", imageUpload, createOrUpdatePubManagment);
router.get("/", getAllPubManagment);
module.exports = router;
