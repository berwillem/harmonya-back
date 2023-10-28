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
    // expiryDate: Date.now(), 
  });
  console.log(new Date())
  try {
    await newsEmail.save();
    console.log("WEEEEEEE")
    return res.status(201).json({ message: "Subscribed to Newsletter" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Failed to subscribe to newsletter" });
  }
};
