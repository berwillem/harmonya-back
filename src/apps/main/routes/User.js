const express = require("express");
const router = express.Router({ mergeParams: true });
const UserController = require("../controllers/UserController");

// user routes :
router.get("/count", UserController.countUsers);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUser);

router.put("/:userId", UserController.setUserInfo);

router.delete("/:id", UserController.deleteUser);

module.exports = router;
