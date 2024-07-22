const express = require("express");
const {
  getNotificationsByUser,
  allMagasinsNotification,
  allUsersNotification,
  userNotification,
  magasinNotification,
  globalNotification,
  getNotificationsByMagasin,
} = require("../controllers/NotificationController");

const router = express.Router({ mergeParams: true });

router.post("/global", globalNotification);
router.post("/users", allUsersNotification);
router.post("/magasins", allMagasinsNotification);
router.post("/user/:userId", userNotification);
router.post("/magasin/:magasinId", magasinNotification);
router.get("/user/:userId", getNotificationsByUser);
router.get("/magasin/:magasinId", getNotificationsByMagasin);

module.exports = router;