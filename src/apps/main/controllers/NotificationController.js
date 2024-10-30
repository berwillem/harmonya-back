// const { notifyGlobal } = require("../../../helpers/notificationUtils");
const io = require("../../../config/socket");
const {
  notifyGlobal,
  notifyAllMagains,
  notifyAllUsers,
  notifyMagasin,
  notifyUser,
} = require("../../../helpers/notificationUtils");
const Notification = require("../models/Notification");

exports.readNotifications = async (req, res) => {
  try {
    const userId = req.params.id;
    const { userType } = req.params;

    const notification = await Notification.updateMany(
      { [userType === "magasin" ? "targetMagasin" : "targetUser"]: userId },
      { read: true }
    );

    return res.status(200).json("notifications read");
  } catch (err) {
    return res.status(500).json({ message: "Failed to read notification" });
  }
};

exports.getNotificationsByUser = async (req, res) => {
  const { userId } = req.params;
  const { type } = req.query;
  let filter = {
    $or: [
      { targetType: "global" },
      { targetType: "group", targetGroup: "users" },
      { targetType: "user", targetUsers: userId },
    ],
  };
  if (type) {
    filter = {
      ...filter,
      type,
    };
  }
  try {
    const notifications = await Notification.find(filter).sort({
      createdAt: -1,
    });
    return res.status(200).json(notifications);
  } catch (err) {
    return res.status(500).json({ message: "Failed to get notifications" });
  }
};

exports.getNotificationsByMagasin = async (req, res) => {
  const { magasinId } = req.params;
  try {
    const notifications = await Notification.find({
      $or: [
        { targetType: "global" },
        { targetType: "group", targetGroup: "magasins" },
        { targetType: "magasin", targetMagasin: magasinId },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json(notifications);
  } catch (err) {
    return res.status(500).json({ message: "Failed to get notifications" });
  }
};

exports.globalNotification = async (req, res) => {
  const { title, message, payload = {}, type = "info" } = req.body;
  try {
    await notifyGlobal({ title, message, payload, type });
    return res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to send notification" });
  }
};

exports.allMagasinsNotification = async (req, res) => {
  const { title, message, payload = {}, type = "info" } = req.body;
  try {
    await notifyAllMagains({ title, message, payload, type });

    return res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to send notification" });
  }
};

exports.allUsersNotification = async (req, res) => {
  const { title, message, payload = {}, type = "info" } = req.body;
  try {
    await notifyAllUsers({ title, message, payload, type });
    return res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to send notification" });
  }
};

exports.userNotification = async (req, res) => {
  const { title, message, payload = {}, type = "info" } = req.body;
  const { userId } = req.params;
  try {
    await notifyUser({ title, message, payload, type, userId });
    return res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to send notification" });
  }
};

exports.magasinNotification = async (req, res) => {
  const { title, message, payload = {}, type = "info" } = req.body;
  const { magasinId } = req.params;
  try {
    await notifyMagasin({ title, message, payload, type, magasinId });
    return res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to send notification" });
  }
};
