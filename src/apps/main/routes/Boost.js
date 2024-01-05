const express = require("express");
const { createBoostRequest, validateBoostRequest, cancelBoostRequest } = require("../controllers/BoostRequestController");
const { createBoostFromRequest } = require("../controllers/BoostController");
const router = express.Router();


router.post("/request/", createBoostRequest)
router.post("/request/validate/", validateBoostRequest)
router.delete("/request/:requestId", cancelBoostRequest)
router.post("/activate/", createBoostFromRequest)

module.exports = router;