const Subscription = require("../models/Subscription");
const SubscriptionRequest = require("../models/SubscriptionRequest");
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
      .json({ message: "Subscription request created successfully.", magasin });
  } catch (error) {
    console.error("Error creating trial subscription:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
exports.startSubscription = async (req, res) => {
  try {
    const { magasinId, type, startDate, endDate, paid, subreq } = req.body;
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
    magasin.subscriptions.push(subscription._id);
    await magasin.save();
    if (subreq) {
      await SubscriptionRequest.findByIdAndDelete(subreq);
    }
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
exports.getAllSubscriptions = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, obj } = req.query;
    const { magasin, type, active } = obj ? JSON.parse(obj) : {};
    // Construire les filtres dynamiquement
    const filters = {};
    if (magasin) {
      filters.magasin = magasin;
    }
    if (type) {
      filters.type = type;
    }
    if (active) {
      filters.active = active == "a" ? true : active == "i" ? false : null;
    }

    // Compter le nombre total d'abonnements en fonction des filtres
    const totalCount = await Subscription.countDocuments(filters);
    const totalPages = Math.ceil(totalCount / pageSize);

    // Récupérer les abonnements en fonction des filtres et des options de pagination
    const subscriptions = await Subscription.find(filters)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ score: -1 });

    return res.status(200).json({ subscriptions, totalPages });
  } catch (error) {
    console.error("Error retrieving subscriptions:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.countSubscriptions = async (req, res) => {
  try {
    const totalCount = await Subscription.countDocuments();
    res.json({ count: totalCount });
  } catch (error) {
    console.error("Error counting subscriptions:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// TODO : change the counts to one bigger controller :
exports.countStandardSubscriptions = async (req, res) => {
  try {
    const totalCount = await Subscription.countDocuments({ type: "standard" });
    return res.status(200).json({ count: totalCount });
  } catch (error) {
    console.error("Error counting standard subscriptions:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
exports.countTrialSubscriptions = async (req, res) => {
  try {
    const totalCount = await Subscription.countDocuments({ type: "trial" });
    return res.status(200).json({ count: totalCount });
  } catch (error) {
    console.error("Error counting trial subscriptions:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.countPremiumSubscriptions = async (req, res) => {
  try {
    const totalCount = await Subscription.countDocuments({ type: "premium" });
    return res.status(200).json({ count: totalCount });
  } catch (error) {
    console.error("Error counting subscriptions:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
exports.countGoldSubscriptions = async (req, res) => {
  try {
    const totalCount = await Subscription.countDocuments({ type: "gold" });
    return res.status(200).json({ count: totalCount });
  } catch (error) {
    console.error("Error counting subscriptions:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
exports.deleteSubscriptions = async (req, res) => {
  const { id } = req.params;
  try {
    const sub = await Subscription.findByIdAndDelete(id);

    if (!sub) {
      return res.status(404).json({ message: "Subscriptions not found" });
    }

    return res.json({
      message: "Subscriptions deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete Subscriptions" });
  }
};

exports.getSubscriptionInfos = async (req, res) => {
  const { id } = req.params;
  try {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const now = new Date();
    const end = new Date(subscription.dates.end);
    let diff = end - now;

    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    diff -= months * 1000 * 60 * 60 * 24 * 30;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * 1000 * 60 * 60 * 24;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * 1000 * 60;

    const seconds = Math.floor(diff / 1000);

    const data = {
      timeleft: {
        months,
        days,
        hours,
        minutes,
        seconds,
      },
      type: subscription.type,
      paid: subscription.paid,
      active: subscription.active,
      start: subscription.dates.start,
      end: subscription.dates.end,
    };
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
