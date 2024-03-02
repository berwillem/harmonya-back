const express = require("express");
const router = express.Router();
const {
  subscribeEmail,
  getAllSubscribedEmails,
} = require("../controllers/NewsletterController");

router.get("/", getAllSubscribedEmails);
router.post("/subscribe", subscribeEmail);

module.exports = router;
