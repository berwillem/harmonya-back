const User = require("../models/User");
const Magasin = require("../models/Magasin")


exports.getBookmarks = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    return res.status(200).json(user.bookmarks)
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

exports.toggleBookmark = async (req, res) => {
  const { userId, storeId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      // User with the specified ID was not found
      return res.status(404).json({ message: "User not found" });
    }

    const isBookmarked = user.bookmarks.stores.includes(storeId);

    if (isBookmarked) {
      // If already bookmarked, unbookmark by removing from the array
      await User.findByIdAndUpdate(userId, {
        $pull: { "bookmarks.stores": storeId },
      });

      await Magasin.findByIdAndUpdate(storeId, {
        $inc: {"data.bookmarks": -1 }
      })

      return res.status(200).json({ message: "Unbookmarked Successfully" });
    } else {
      // If not bookmarked, bookmark by adding to the array
      await User.findByIdAndUpdate(userId, {
        $push: { "bookmarks.stores": storeId },
      });

      await Magasin.findByIdAndUpdate(storeId, {
        $inc: {"data.bookmarks": 1 }
      })

      return res.status(201).json({ message: "Bookmarked Successfully" });
    }
  } catch (err) {
    console.error(err);
    // Handle other errors, maybe log them for debugging purposes
    return res.status(500).json({ message: "Internal Server Error" });
  }
};