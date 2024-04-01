const express = require("express");
const router = express.Router({ mergeParams: true });
const UserController = require("../controllers/UserController");

// user routes :

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
