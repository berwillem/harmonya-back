const cron = require("node-cron");
const Subscription = require("../apps/main/models/Subscription");

const updateExpiredSubscriptions = cron.schedule("0 0 * * *", async () => {
  try {
    const expiredSubscriptions = await Subscription.find({
      "dates.end": { $lte: new Date() },
      active: true,
    });
    await Promise.all(
      expiredSubscriptions.map(async (subscription) => {
        subscription.active = false;
        await subscription.save();
      })
    );
    console.log("Expired subscriptions updated successfully.");
  } catch (error) {
    console.error("Error updating expired subscriptions:", error);
  }
});

module.exports = updateExpiredSubscriptions;
