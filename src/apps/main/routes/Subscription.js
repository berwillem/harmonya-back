const express = require("express");
const router = express.Router();
const {
  createTrialSubscription,
  startSubscription,
  getSubscriptionsByMagasinId,
} = require("../controllers/SubsciptionController");
router.post("/trial", createTrialSubscription);
router.post("/", startSubscription);
router.post("/", startSubscription);
router.get("/:magasinId", getSubscriptionsByMagasinId);

module.exports = router;
