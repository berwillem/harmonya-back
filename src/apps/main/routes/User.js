const express = require("express");
const router = express.Router({ mergeParams: true });
const UserController = require("../controllers/UserController");
const { verifyToken } = require("../../../middlewares/authval");

// user routes :

router.get("/:id", UserController.getUser);
router.get("/bookmarks/:id", UserController.getBookmarks)
router.post("/bookmarks/", UserController.toggleBookmark)


module.exports = router;
