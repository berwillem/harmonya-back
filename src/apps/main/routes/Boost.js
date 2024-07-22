const express = require("express");
const {
  createBoostRequest,
  validateBoostRequest,
  cancelBoostRequest,
  getAllBoostRequests,
  invalidateBoostRequest,
  prepareBoostRequest,
  unprepareBoostRequest,
  getBoostsReqByIdMagasian,
} = require("../controllers/BoostRequestController");
const {
  createBoostFromRequest,
  getAllBoosts,
  cancelBoost,
  countBoosts,
  getBoostsByIdMagasian,
} = require("../controllers/BoostController");

const router = express.Router();
router.post("/", createBoostRequest);
router.post("/validate", validateBoostRequest);
router.post("/invalidate", invalidateBoostRequest);
router.post("/prepare", prepareBoostRequest)
router.post("/unprepare", unprepareBoostRequest)
router.post("/activate", createBoostFromRequest);

router.get("/boostreq", getAllBoostRequests);
router.get("/", getAllBoosts);
router.get("/count", countBoosts);
router.get("/boostreq/:magasinid", getBoostsReqByIdMagasian);
router.get("/:magasinid", getBoostsByIdMagasian);

router.delete("/boostreq/:requestId", cancelBoostRequest);
router.delete("/:boostId", cancelBoost);


module.exports = router;
