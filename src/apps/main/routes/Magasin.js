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
const { getBookingRequestsByMagasin } = require("../controllers/BookingRequestController");
const router = express.Router();

router.get("/", getAllMagasins);
router.get("/services", getMagasinServices);
router.get("/infos", getMagasinInfos);
router.get("/stores/:id", getMagasinStores);
router.get("/count", countMagasins);
router.get("/:id/reservations",getBookingRequestsByMagasin);
router.get("/:id", getMagasinById);

router.put("/tour/:magasinid", updateMagasinTour);
router.put(
  "/update/:magasinId",
  // imageUploadLimit,
  dynamicImageUpload,
  setMagasinInfo
);

router.delete("/:magasinid", deleteMagasin);

module.exports = router;
