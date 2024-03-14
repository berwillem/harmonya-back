const SubscriptionRequest = require("../models/SubscriptionRequest");
const Magasin = require("../models/Magasin");

exports.getAllSubscriptionRequests = async (req, res) => {
  try {
    const subscriptionRequests = await SubscriptionRequest.find().populate(
      "magasin",
      "magasinName"
    );
    return res.status(200).json(subscriptionRequests);
  } catch (error) {
    console.error("Error retrieving subscription requests:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.createSubscriptionRequest = async (req, res) => {
  try {
    const { magasinId, type, request, duration } = req.body;
    if (!magasinId || !type || !request) {
      return res
        .status(400)
        .json({ message: "Magasin ID, type, and request are required." });
    }
    if (!["standard", "premium", "gold"].includes(type)) {
      return res.status(400).json({ message: "Invalid subscription type." });
    }
    if (!["new", "renew"].includes(request)) {
      return res.status(400).json({ message: "Invalid request type." });
    }
    const magasin = await Magasin.findById(magasinId);
    if (!magasin) {
      return res.status(404).json({ message: "Magasin not found." });
    }
    const subscriptionRequest = new SubscriptionRequest({
      magasin: magasinId,
      type,
      request,
      duration,
    });
    await subscriptionRequest.save();
    return res
      .status(201)
      .json({ message: "Subscription request created successfully." });
  } catch (error) {
    console.error("Error creating subscription request:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
