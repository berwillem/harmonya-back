const User = require("../models/User");
exports.getAllUsers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = 10;

    const totalCount = await User.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    const users = await User.find({}, "-password")
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return res.status(200).json({ users, totalPages });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getUser = async (req, res) => {
  const userId = req.params.id;
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
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted succefuly");
  } catch (error) {
    return new Error(error);
  }
};

exports.countUsers = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ count: userCount });
  } catch (err) {
    console.error("Error counting users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
