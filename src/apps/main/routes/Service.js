const express = require("express");
const router = express.Router({ mergeParams: true });
const ServiceController = require("../controllers/ServiceController");
const { multipleImageUpload } = require("../../../middlewares/imageUpload");

// user auth routes :
router.get("/", ServiceController.getAllServices);
router.post("/", multipleImageUpload, ServiceController.createService);
router.get("/category/:id", ServiceController.getServicesByCategory);
router.get("/id/:id", ServiceController.getServiceById);

module.exports = router;
