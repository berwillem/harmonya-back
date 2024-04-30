const express = require("express");
const router = express.Router();
const {
  createTrialSubscription,
  startSubscription,
  getSubscriptionsByMagasinId,
  getAllSubscriptions,
  countStandardSubscriptions,
  countPremiumSubscriptions,
  countGoldSubscriptions,
  countSubscriptions,
  countTrialSubscriptions,
  
} = require("../controllers/SubsciptionController");
router.post("/trial", createTrialSubscription);
router.post("/", startSubscription);
router.get("/count", countSubscriptions);
router.get("/countStandard", countStandardSubscriptions);
router.get("/countPremium", countPremiumSubscriptions);
router.get("/countGold", countGoldSubscriptions);
router.get("/countTrial", countTrialSubscriptions);
router.get("/", getAllSubscriptions);
router.get("/:magasinId", getSubscriptionsByMagasinId);



module.exports = router;
