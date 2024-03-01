const User = require("../models/User");
const Magasin = require("../models/Magasin");

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

exports.toggleBookmark = async (req, res) => {
  const { userId, targetId, type } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      // User with the specified ID was not found
      return res.status(404).json({ message: "User not found" });
    }
    if (type === "service") {
      const isBookmarked = user.bookmarks.services.includes(targetId);
      if (isBookmarked) {
        // If already bookmarked, unbookmark by removing from the array
        await User.findByIdAndUpdate(userId, {
          $pull: { "bookmarks.services": targetId },
        });

        return res.status(200).json({ message: "Unbookmarked Successfully" });
      } else {
        // If not bookmarked, bookmark by adding to the array
        
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            $push: { "bookmarks.services": targetId },
          },
          { new: true }
        );

        return res
          .status(201)
          .json({ message: "Bookmarked Successfully", updatedUser });
      }
    } else {
      const isBookmarked = user.bookmarks.stores.includes(targetId);

      if (isBookmarked) {
        // If already bookmarked, unbookmark by removing from the array
        await User.findByIdAndUpdate(userId, {
          $pull: { "bookmarks.stores": targetId },
        });

        await Magasin.findByIdAndUpdate(targetId, {
          $inc: { "data.bookmarks": -1 },
        });

        return res.status(200).json({ message: "Unbookmarked Successfully" });
      } else {
        // If not bookmarked, bookmark by adding to the array
        await User.findByIdAndUpdate(userId, {
          $push: { "bookmarks.stores": targetId },
        });

        await Magasin.findByIdAndUpdate(targetId, {
          $inc: { "data.bookmarks": 1 },
        });

        return res.status(201).json({ message: "Bookmarked Successfully" });
      }
    }
  } catch (err) {
    console.error(err);
    // Handle other errors, maybe log them for debugging purposes
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
