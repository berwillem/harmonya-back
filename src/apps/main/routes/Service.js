const express = require("express");
const router = express.Router({ mergeParams: true });
const ServiceController = require("../controllers/ServiceController");
const {
  verifyToken,
  checkMagasinAccess,
} = require("../../../middlewares/authval");

// user auth routes :
router.get("/", ServiceController.getAllServices);
router.post("/", ServiceController.createService);
router.get("/category/:id", ServiceController.getServicesByCategory)
router.get("/id/:id", ServiceController.getServiceById)
module.exports = router;
    