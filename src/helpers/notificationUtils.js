// const { createNotification } = require("../apps/main/controllers/NotificationController");

const Notification = require("../apps/main/models/Notification");
const {io, userSockets} = require("../config/socket");

exports.createNotification = async (notifObject) => {

    const notification = new Notification(notifObject);
    
    //realtime socket.io logic
    await notification.save();
    return notification;
  
};

const { createNotification } = exports;
exports.notifyUser = async ({ userId, title, message, payload,type}) => {
  await createNotification({
    title,
    message,
    payload,
    targetType: "user",
    targetUser: userId,
    type
  });
  io.in(userSockets[userId]).emit("notification", {
    title,
    message,
    payload,
    targetType: "user",
    targetUser: userId,
    type
  })
};

exports.notifyMagasin = async ({ magasinId, title, message, payload = {}, type }) => {
  await createNotification({
    title,
    message,
    payload,
    targetType: "magasin",
    targetMagasin: magasinId,
    type
  });
  io.in(userSockets[magasinId]).emit("notification", {
    title,
    message,
    payload,
    targetType: "magasin",
    targetMagasin: magasinId,
    type
  })
};

exports.notifyAllUsers = async ({ title, message, payload, type}) => {
  await createNotification({
    title,
    message,
    payload,
    targetType: "group",
    targetGroup: "users",
    type
  });
  io.in("users").emit("notification", {
    title,
    message,
    payload,
    targetType: "group",
    targetGroup: "users",
    type
  })

};

exports.notifyAllMagains = async ({ title, message, payload, type }) => {
  await createNotification({
    title,
    message,
    payload,
    targetType: "group",
    targetGroup: "magasins",
    type
  });
  io.in("magasins").emit("notification", {
    title,
    message,
    payload,
    targetType: "group",
    targetGroup: "magasins",
    type
  })
};

exports.notifyGlobal = async ({ title, message, payload, type}) => {
  await createNotification({
    title,
    message,
    payload,
    targetType: "global",
    type
  });
  io.emit("notification", {
    title,
    message,
    payload,
    targetType: "global",
    type
  })

};
