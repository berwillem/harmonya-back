const express = require("express");
const router = express.Router({ mergeParams: true });
const ServiceController = require("../controllers/ServiceController");
const {
  multipleImageUpload,
  imageUploadLimit,
  dynamicImageUpload,
} = require("../../../middlewares/imageUpload");

router.post(
  "/:magasinId",
  imageUploadLimit,
  dynamicImageUpload,
  ServiceController.createService
);

router.get("/", ServiceController.getAllServices);
router.get("/category/:id", ServiceController.getServicesByCategory);
router.get(
  "/subcategory/:souscategoryId",
  ServiceController.getServicesBySubCategory
);
router.get("/id/:id", ServiceController.getServiceById);

router.put(
  "/:serviceId",
  dynamicImageUpload,
  ServiceController.updateServiceById
);

router.delete("/id/:id", ServiceController.deleteServiceById);

module.exports = router;
