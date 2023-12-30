const express = require("express");

const {
  getAllMagasins,
  setMagasinInfo,
  getMagasinServices,
  getMagasinInfos,
} = require("../controllers/MagasinController");
const router = express.Router();

router.get("/", getAllMagasins);
router.post("/update", setMagasinInfo);
router.get("/services", getMagasinServices);
router.get("/infos", getMagasinInfos);


module.exports = router;
