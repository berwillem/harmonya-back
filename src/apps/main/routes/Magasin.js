const express = require("express");

const {
  getAllMagasins,
  setMagasinInfo,
  getMagasinServices,
  getMagasinInfos,
  getMagasinStores,
  deleteMagasin,
  updateMagasinTour,
  countMagasins,
} = require("../controllers/MagasinController");
const {
  multipleImageUpload,
  imageUpload,
} = require("../../../middlewares/imageUpload");
const router = express.Router();

router.get("/", getAllMagasins);
router.put("/update", imageUpload, multipleImageUpload, setMagasinInfo);
router.get("/services", getMagasinServices);
router.get("/infos", getMagasinInfos);
router.get("/stores/:id", getMagasinStores);
router.delete("/:magasinid", deleteMagasin);
router.put("/tour/:magasinid", updateMagasinTour);
router.get("/count", countMagasins);

module.exports = router;
