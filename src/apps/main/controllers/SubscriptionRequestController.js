const SubscriptionRequest = require("../models/SubscriptionRequest");
const Magasin = require("../models/Magasin");

exports.createSubscriptionRequest = async (req, res) => {
  try {

    const { magasinId, type, request } = req.body;
    
    const newSubscriptionRequest = new SubscriptionRequest({
      magasin: magasinId,
      type,
      request,
    });

    await newSubscriptionRequest.save();

    await Magasin.findByIdAndUpdate(magasinId, {
      $push: { subscriptionRequests: newSubscriptionRequest._id },
    });

    res.status(201).json({
      message: "Subscription request created successfully",
      subscriptionRequest: newSubscriptionRequest,
    });
  } catch (error) {
    console.error("Error creating subscription request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
