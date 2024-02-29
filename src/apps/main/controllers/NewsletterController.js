const NewsletterEmail = require("../models/NewsletterEmail");

exports.subscribeEmail = async (req, res) => {
  const { email } = req.body;
  let existingEmail;
  try {
    existingEmail = await NewsletterEmail.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }
  if (existingEmail) {
    return res
      .status(400)
      .json({ message: "Email already subscribed to newsletter." });
  }
  const newsEmail = new NewsletterEmail({
    email: email,
  });
  try {
    await newsEmail.save();
    return res.status(201).json({ message: "Subscribed to Newsletter" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Failed to subscribe to newsletter" });
  }
};
exports.getAllSubscribedEmails = async (req, res) => {
  try {
    const subscribedEmails = await NewsletterEmail.find();
    return res.status(200).json({ emails: subscribedEmails });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Failed to retrieve subscribed emails" });
  }
};
