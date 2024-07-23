const express = require("express");
const router = express.Router({mergeParams: true});
const BookmarksController = require("../controllers/BookmarksController")

router.post("/", BookmarksController.toggleBookmark)

router.get("/:id", BookmarksController.getBookmarks)

module.exports = router;
