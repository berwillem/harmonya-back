const express = require("express");
const router = express.Router({ mergeParams: true });
const SubsciptionController = require("../controllers/SubsciptionController");

// user auth routes :
router.post("/trial", SubsciptionController.startFreeTrial);

module.exports = router;
