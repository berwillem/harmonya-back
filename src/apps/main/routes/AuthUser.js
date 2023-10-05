const express = require("express");
const router = express.Router({ mergeParams: true });
const AuthUserController = require("../controllers/AuthUserController");
const { verifyToken } = require("../../../middlewares/authval");

// user auth routes :

router.post("/signup", AuthUserController.signup);
router.post("/login", AuthUserController.login);
router.post("/logout", verifyToken, AuthUserController.logout);

module.exports = router;
