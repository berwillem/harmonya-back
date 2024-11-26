const express = require("express");
const router = express.Router({ mergeParams: true });
const StoreController = require("../controllers/StoreController"); // Replace with the correct path to your controller file
const {
  getBookingRequestsByStore,
} = require("../controllers/BookingRequestController");
const { imageUploadLimit, multipleImageUpload, dynamicImageUpload } = require("../../../middlewares/imageUpload");

// Store routes:

// CREATE - Create a new store
router.post("/:magasinId",imageUploadLimit,
  dynamicImageUpload, StoreController.createStore);
router.post("/closehour", StoreController.closeHour);

router.get("/", StoreController.getAllStores);
router.get("/agenda/:id", StoreController.getStoreAgenda);
router.get("/employees/:id", StoreController.getStoreEmployees);
router.get("/:storeId/reservations", getBookingRequestsByStore);
router.get("/:id", StoreController.getStoreById);

router.put("/:id", StoreController.updateStoreById);

router.delete("/:id", StoreController.deleteStoreById);

module.exports = router;
