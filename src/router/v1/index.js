const { Router } = require("express");

const router = Router();
router.use("/auth/user", require("../../apps/main/routes/AuthUser"));
router.use("/auth/magasin", require("../../apps/main/routes/AuthMagasin"));
router.use("/user", require("../../apps/main/routes/User"));
router.use("/service", require("../../apps/main/routes/Service"));
router.use("/newsletter", require("../../apps/main/routes/NewsLetter"))
module.exports = router;
