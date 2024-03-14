const express = require("express");
const router = express.Router();
const {
  createTrialSubscription,
  startSubscription,
} = require("../controllers/SubsciptionController");

router.post("/trial", createTrialSubscription);
router.post("/", startSubscription);

module.exports = router;
