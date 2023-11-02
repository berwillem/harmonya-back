const Magasin = require("../apps/main/models/Magasin");

const checkAuthorization = (requiredSubscriptionType) => {
  return async (req, res, next) => {
    try {
      const magasinId = req.body.magasinId;
      const magasin = await Magasin.findById(magasinId).populate(
        "subscription"
      );
      if (!magasin) {
        return res.status(404).json({ error: "Magasin not found" });
      }
      const magasinSubscription = magasin.subscription;
      if (!magasinSubscription) {
        return res
          .status(403)
          .json({ error: "Magasin has no active subscription" });
      }

      const magasinSubscriptionType = magasinSubscription.type;
      if (magasinSubscriptionType !== requiredSubscriptionType) {
        return res
          .status(403)
          .json({ error: "Unauthorized subscription type" });
      }
      next();
    } catch (error) {
      console.error("Authorization check error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports = checkAuthorization;
