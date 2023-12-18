const User = require("../models/User");

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

exports.getBookmarks = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    return res.status(200).json(user.bookmarks);
  } catch (error) {
    console.log(error);

    return res.status(400);
  }
};

exports.addBookmark = async (req, res) => {
  const { userId, storeId } = req.body;
  try {
    await User.findByIdAndUpdate(userId, {
      $push: { "bookmarks.stores": storeId },
    });

    return res.status(201).json({ message: "Bookmarked Successfully" });
  } catch (err) {
    console.log(err);
  }
};

exports.toggleBookmark = async (req, res) => {
  const { userId, storeId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookmarked = user.bookmarks.stores.includes(storeId);

    if (isBookmarked) {
      await User.findByIdAndUpdate(userId, {
        $pull: { "bookmarks.stores": storeId },
      });

      return res.status(200).json({ message: "Unbookmarked Successfully" });
    } else {
      await User.findByIdAndUpdate(userId, {
        $push: { "bookmarks.stores": storeId },
      });

      return res.status(201).json({ message: "Bookmarked Successfully" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
