const express = require("express");
const {
  createBoostRequest,
  validateBoostRequest,
  cancelBoostRequest,
  getAllBoostRequests,
  getallBoosts,
} = require("../controllers/BoostRequestController");
const { createBoostFromRequest } = require("../controllers/BoostController");
const router = express.Router();
router.get("/boostreq", getAllBoostRequests);
router.get("/", getallBoosts);
router.post("/", createBoostRequest);
router.post("/validate", validateBoostRequest);
router.delete("/:requestId", cancelBoostRequest);
router.post("/activate", createBoostFromRequest);

module.exports = router;
