const express = require("express");
const {
  createSubscriptionRequest,
  getAllSubscriptionRequests,
  deleteSubscriptionRequest,
} = require("../controllers/SubscriptionRequestController");
const router = express.Router();
router.get("/", getAllSubscriptionRequests);
router.post("/", createSubscriptionRequest);
router.delete("/:id", deleteSubscriptionRequest);

module.exports = router;
