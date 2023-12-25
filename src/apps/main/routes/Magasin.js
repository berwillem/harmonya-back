const express = require("express");

const {
  getAllMagasin,
  setMagasinInfo,
  getMagasinServices,
  getMagasinInfos,
  getMagasinsByCategory,
} = require("../controllers/MagasinController");
const router = express.Router();

router.get("/", getAllMagasin);
router.post("/update", setMagasinInfo);
router.get("/services", getMagasinServices);
router.get("/infos", getMagasinInfos);
router.get("/category/:id", getMagasinsByCategory);

module.exports = router;
