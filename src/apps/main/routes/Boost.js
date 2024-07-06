const express = require("express");
const {
  createBoostRequest,
  validateBoostRequest,
  cancelBoostRequest,
  getAllBoostRequests,
  invalidateBoostRequest,
} = require("../controllers/BoostRequestController");
const {
  createBoostFromRequest,
  getAllBoosts,
  cancelBoost,
  countBoosts,
} = require("../controllers/BoostController");
const router = express.Router();
router.get("/boostreq", getAllBoostRequests);
router.get("/", getAllBoosts);
router.post("/", createBoostRequest);
router.post("/validate", validateBoostRequest);
router.post("/invalidate", invalidateBoostRequest);
router.delete("/boostreq/:requestId", cancelBoostRequest);
router.post("/activate", createBoostFromRequest);
router.delete("/:boostId", cancelBoost);
router.get("/count", countBoosts);

module.exports = router;
