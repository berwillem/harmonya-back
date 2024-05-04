const cron = require("node-cron");
const Subscription = require("../apps/main/models/Subscription");
const Agenda = require("../apps/main/models/Agenda")

exports.updateExpiredSubscriptions = cron.schedule("0 0 * * *", async () => {
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

exports.updateAgendas = cron.schedule("0 23 * * *", async () => {
  try {
    const agendas = await Agenda.find({}).select("agenda startDate")
    const bulkOps = agendas.map(agenda => {
      const agendaArr = agenda.agenda
      agendaArr.push(agendaArr.shift());
      return {
      updateOne: {
        filter: { _id: agenda._id },
        update: {
          $set: {
            startDate: (new Date(agenda.startDate)).setHours(24, 0, 0, 0),
            agenda: agendaArr
          }
        }
      }
    }
  });
    await Agenda.bulkWrite(bulkOps);
  } catch(error) {
    console.error("Error updating agendas")
  }
})

// module.exports = updateExpiredSubscriptions;
