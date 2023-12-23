const express = require("express");
const router = express.Router({ mergeParams: true });
const UserController = require("../controllers/UserController");
const { verifyToken } = require("../../../middlewares/authval");

// user routes :

router.get("/:id", UserController.getUser);



module.exports = router;
