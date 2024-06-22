const express = require("express");
const router = express.Router({ mergeParams: true });
const ServiceController = require("../controllers/ServiceController");
const {
  multipleImageUpload,
  imageUploadLimit,
} = require("../../../middlewares/imageUpload");

// user auth routes :
router.get("/", ServiceController.getAllServices);
router.post(
  "/",
  imageUploadLimit,
  multipleImageUpload,
  ServiceController.createService
);
router.get("/category/:id", ServiceController.getServicesByCategory);
router.get("/id/:id", ServiceController.getServiceById);
router.delete("/id/:id", ServiceController.deleteServiceById);

module.exports = router;
