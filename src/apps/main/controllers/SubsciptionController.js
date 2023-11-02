const Subscription = require("../models/Subscription");
const Magasin = require("../models/Magasin");

exports.startFreeTrial = async (req, res) => {
  try {
    const magasinId = req.query.magasinId;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);
    const newSubscription = new Subscription({
      magasin: magasinId,
      type: "standard",
      active: true,
      dates: {
        start: startDate,
        end: endDate,
      },
      paid: false,
      trial: true,
    });
    await newSubscription.save();
    await Magasin.findByIdAndUpdate(magasinId, {
      $push: { subscriptions: newSubscription._id },
    });

    res.status(201).json({
      message: "Free trial started successfully",
      subscription: newSubscription,
    });
  } catch (error) {
    console.error("Error starting free trial:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
