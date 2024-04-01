const express = require("express");

const {
  getAllMagasins,
  setMagasinInfo,
  getMagasinServices,
  getMagasinInfos,
  getMagasinStores,
  deleteMagasin,
} = require("../controllers/MagasinController");
const router = express.Router();

router.get("/", getAllMagasins);
router.post("/update", setMagasinInfo);
router.get("/services", getMagasinServices);
router.get("/infos", getMagasinInfos);
router.get("/stores/:id", getMagasinStores);
router.delete("/:magasinid", deleteMagasin);

module.exports = router;
