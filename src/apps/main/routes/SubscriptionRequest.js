const express = require("express");
const {
  createSubscriptionRequest,
  getAllSubscriptionRequests,
} = require("../controllers/SubscriptionRequestController");
const router = express.Router();
router.get("/", getAllSubscriptionRequests);
router.post("/", createSubscriptionRequest);

module.exports = router;
