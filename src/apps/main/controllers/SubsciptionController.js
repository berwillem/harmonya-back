const Subscription = require("../models/Subscription");

exports.startFreeTrial = async (req, res) => {
  try {
    const { magasinId } = req.params;
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
    res.status(201).json({
      message: "Free trial started successfully",
      subscription: newSubscription,
    });
  } catch (error) {
    console.error("Error starting free trial:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

