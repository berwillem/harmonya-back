const express = require("express");
const router = express.Router({mergeParams: true});
const BookmarksController = require("../controllers/BookmarksController")

router.get("/:id", BookmarksController.getBookmarks)
router.post("/", BookmarksController.toggleBookmark)

module.exports = router;
