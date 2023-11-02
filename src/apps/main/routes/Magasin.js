const express = require("express");
const { getAllMagasin } = require("../controllers/MagasinController");
const router = express.Router();

router.get("/", getAllMagasin);

module.exports = router;
