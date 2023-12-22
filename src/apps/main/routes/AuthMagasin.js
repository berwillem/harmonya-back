const express = require("express");
const router = express.Router({ mergeParams: true });
const AuthMagasinController = require("../controllers/AuthMagasinController");
const { verifyToken } = require("../../../middlewares/authval");
const {
  isResetTokenValidMagasin,
} = require("../../../middlewares/resetTokenValidation");

// user auth routes :

router.post("/signup", AuthMagasinController.signup);
router.post("/login", AuthMagasinController.login);
router.post("/logout", verifyToken, AuthMagasinController.logout);
router.post("/passforgot", AuthMagasinController.forgotPasswordMagasin);
router.post(
  "/resetpass",
  isResetTokenValidMagasin,
  AuthMagasinController.resetpassword
);

module.exports = router;
