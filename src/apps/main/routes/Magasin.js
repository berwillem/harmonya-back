const express = require("express");

// /magasin
const {
  getAllMagasins,
  setMagasinInfo,
  getMagasinServices,
  getMagasinInfos,
  getMagasinStores,
  deleteMagasin,
  updateMagasinTour,
  countMagasins,
  getMagasinById,
} = require("../controllers/MagasinController");
const {
  multipleImageUpload,
  imageUploadLimit,
  dynamicImageUpload,
} = require("../../../middlewares/imageUpload");
const router = express.Router();

router.get("/", getAllMagasins);
router.put(
  "/update/:magasinId",
  // imageUploadLimit,
  dynamicImageUpload,
  setMagasinInfo
);


router.get("/services", getMagasinServices);
router.get("/infos", getMagasinInfos);
// router.put("/infos/:magasinId", update)
router.get("/stores/:id", getMagasinStores);
router.delete("/:magasinid", deleteMagasin);
router.put("/tour/:magasinid", updateMagasinTour);
router.get("/count", countMagasins);

router.get("/:id", getMagasinById);

module.exports = router;
