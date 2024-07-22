const express = require("express");
const router = express.Router({ mergeParams: true });
const StatReceipController = require("../controllers/StatReceipController");

router.get("/:IdMagasain", StatReceipController.getRevenusByMagasain);
router.get("/topsell/:IdMagasain", StatReceipController.getTopServices);
router.get("/stat/:IdMagasain", StatReceipController.countReciep);
router.get("/stat/revenues/:magasinId/:year", StatReceipController.getMonthlyRevenues);

module.exports = router;
