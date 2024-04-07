const Subscription = require("../models/Subscription");
const Magasin = require("../models/Magasin");

exports.createTrialSubscription = async (req, res) => {
  try {
    const { magasinId } = req.body;
    if (!magasinId) {
      return res.status(400).json({ message: "Magasin ID is required." });
    }
    const magasin = await Magasin.findById(magasinId);

    if (!magasin) {
      return res.status(404).json({ message: "Magasin not found." });
    }
    if (magasin.trial) {
      return res
        .status(400)
        .json({ message: "Trial subscription already active for this store." });
    }

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
      .json({ message: "Trial subscription created successfully." });
  } catch (error) {
    console.error("Error creating trial subscription:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
exports.startSubscription = async (req, res) => {
  try {
    const { magasinId, type, startDate, endDate, paid } = req.body.data;
    if (!magasinId || !type || !startDate || !endDate) {
      return res.status(400).json({
        message: "Magasin ID, type, start date, and end date are required.",
      });
    }
    const magasin = await Magasin.findById(magasinId);
    if (!magasin) {
      return res.status(404).json({ message: "Magasin not found." });
    }
    const subscription = new Subscription({
      magasin: magasinId,
      type,
      active: true,
      dates: {
        start: new Date(startDate),
        end: new Date(endDate),
      },
      paid,
    });
    await subscription.save();
    return res
      .status(201)
      .json({ message: "Subscription started successfully." });
  } catch (error) {
    console.error("Error starting subscription:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
exports.updateSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { type, startDate, endDate, paid, active } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ message: "Subscription ID is required." });
    }

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found." });
    }

    if (type) {
      subscription.type = type;
    }
    if (startDate) {
      subscription.dates.start = new Date(startDate);
    }
    if (endDate) {
      subscription.dates.end = new Date(endDate);
    }
    if (paid !== undefined) {
      subscription.paid = paid;
    }
    if (active !== undefined) {
      subscription.active = active;
    }

    await subscription.save();

    return res
      .status(200)
      .json({ message: "Subscription updated successfully." });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
exports.getSubscriptionsByMagasinId = async (req, res) => {
  try {
    const { magasinId } = req.params;
    const subscriptions = await Subscription.find({ magasin: magasinId });
    if (!subscriptions) {
      return res
        .status(404)
        .json({ message: "Subscriptions not found for this magasin." });
    }
    return res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Error retrieving subscriptions:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
