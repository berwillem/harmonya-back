const express = require("express");
const { addAlert } = require("../controllers/AlertController");
const router = express.Router({mergeParams:true})


router.post("/", addAlert);

module.exports = router