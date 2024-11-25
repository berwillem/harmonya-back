const SubscriptionRequest = require("../models/SubscriptionRequest");
const Magasin = require("../models/Magasin");
const Subscription = require("../models/Subscription");

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

    const currentDate = new Date();
    const expirationDate = new Date(
      currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    const trialSubscription = new Subscription({
      magasin: magasinId,
      type: "trial",
      active: true,
      trial: true,
      dates: {
        start: currentDate,
        end: expirationDate,
      },
    });

    await trialSubscription.save();
    magasin.trial = true;
    magasin.subscriptions.push(trialSubscription._id);
    await magasin.save();

    return res
      .status(201)
      .json({ message: "Subscription request created successfully.", magasin });
  } catch (error) {
    console.error("Error creating subscription request:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
exports.deleteSubscriptionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubscriptionRequest =
      await SubscriptionRequest.findByIdAndDelete(id);
    if (!deletedSubscriptionRequest) {
      return res
        .status(404)
        .json({ message: "Subscription request not found." });
    }
    return res
      .status(200)
      .json({ message: "Subscription request deleted successfully." });
  } catch (error) {
    console.error("Error deleting subscription request:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
exports.getSubscriptionRequestsByMagasinId = async (req, res) => {
  try {
    const { magasinId } = req.params;
    const subscriptionRequests = await SubscriptionRequest.find({
      magasin: magasinId,
    }).populate("magasin", "magasinName");
    if (!subscriptionRequests) {
      return res
        .status(404)
        .json({ message: "Subscription requests not found for this magasin." });
    }
    return res.status(200).json(subscriptionRequests);
  } catch (error) {
    console.error("Error retrieving subscription requests:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
