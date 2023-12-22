const express = require("express");
const router = express.Router({ mergeParams: true });
const AuthUserController = require("../controllers/AuthUserController");
const { verifyToken } = require("../../../middlewares/authval");
const {
  isResetTokenValidUser,
} = require("../../../middlewares/resetTokenValidation");

// user auth routes :

router.post("/signup", AuthUserController.signup);
router.post("/login", AuthUserController.login);
router.post("/logout", verifyToken, AuthUserController.logout);
router.post("/passforgot", AuthUserController.forgotPasswordUser);
router.post(
  "/resetpass",
  isResetTokenValidUser,
  AuthUserController.resetpassword
);

module.exports = router;
