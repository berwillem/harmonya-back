const express = require("express");
const {
  createSubscriptionRequest,
  getAllSubscriptionRequests,
  deleteSubscriptionRequest,
  getSubscriptionRequestsByMagasinId,
} = require("../controllers/SubscriptionRequestController");
const router = express.Router();
router.get("/", getAllSubscriptionRequests);
router.get("/:magasinId", getSubscriptionRequestsByMagasinId);
router.post("/", createSubscriptionRequest);
router.delete("/:id", deleteSubscriptionRequest);

module.exports = router;
