const express = require("express");
const {
  createSubscriptionRequest,
  getAllSubscriptionRequests,
  deleteSubscriptionRequest,
  getSubscriptionRequestsByMagasinId,
} = require("../controllers/SubscriptionRequestController");
const router = express.Router();

router.post("/", createSubscriptionRequest);

router.get("/", getAllSubscriptionRequests);
router.get("/:magasinId", getSubscriptionRequestsByMagasinId);

router.delete("/:id", deleteSubscriptionRequest);

module.exports = router;
