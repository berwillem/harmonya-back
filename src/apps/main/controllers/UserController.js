const User = require("../models/User");

exports.getUser = async (req, res, next) => {
  const userId = req.id;
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (error) {
    return new Error(error);
  }
  if (!user) {
    return res.status(404).json({
      message: "User not Found",
    });
  }
  return res.status(200).json({ user });
};
