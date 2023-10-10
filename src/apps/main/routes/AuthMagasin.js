const express = require("express");
const router = express.Router({ mergeParams: true });
const AuthMagasinController = require("../controllers/AuthMagasinController");
const { verifyToken } = require("../../../middlewares/authval");

// user auth routes :

router.post("/signup", AuthMagasinController.signup);
router.post("/login", AuthMagasinController.login);
router.post("/logout", verifyToken, AuthMagasinController.logout);

module.exports = router;
