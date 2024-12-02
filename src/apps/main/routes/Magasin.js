const express = require("express");

// magasin
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
  getMagasinsBySousCategory,
  getStep,
  updateMagasinStep,
  addUserToBlacklist,
  removeUserFromBlacklist,
} = require("../controllers/MagasinController");
const {
  multipleImageUpload,
  imageUploadLimit,
  dynamicImageUpload,
} = require("../../../middlewares/imageUpload");
const {
  getBookingRequestsByMagasin,
} = require("../controllers/BookingRequestController");
const router = express.Router();

router.get("/", getAllMagasins);
router.get("/services", getMagasinServices);
router.get("/infos", getMagasinInfos);
router.get("/stores/:id", getMagasinStores);
router.get("/count", countMagasins);
router.get("/:id/reservations", getBookingRequestsByMagasin);
router.get("/:id", getMagasinById);
router.put("/step/:magasinid", updateMagasinStep);
router.put("/tour/:magasinid", updateMagasinTour);
router.put(
  "/update/:magasinId",
  // imageUploadLimit,
  dynamicImageUpload,
  setMagasinInfo
);

router.get("/subcategories/:id/magasins", getMagasinsBySousCategory);
router.delete("/:magasinid", deleteMagasin);
router.put("/:magasinId/addtoblacklist/:userId", addUserToBlacklist);
router.put("/:magasinId/removefromblacklist/:userId", removeUserFromBlacklist);


module.exports = router;
