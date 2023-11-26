const express = require("express");
const MagasinController = require("../controllers/MagasinController");
const trackMagasinVisit = require("../../../middlewares/TrackVist");
const router = express.Router();

router.get("/", MagasinController.getAllMagasin);
router.get('/:id', trackMagasinVisit, MagasinController.getMagasinById);

module.exports = router;
