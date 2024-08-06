const express = require("express");
const router = express.Router();
const {
  subscribeEmail,
  getAllSubscribedEmails,
} = require("../controllers/NewsletterController");

router.post("/subscribe", subscribeEmail);

router.get("/", getAllSubscribedEmails);

module.exports = router;
