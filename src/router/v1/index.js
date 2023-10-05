const { Router } = require("express");

const router = Router();
router.use("/auth", require("../../apps/main/routes/AuthUser"));
router.use("/user", require("../../apps/main/routes/User"));

module.exports = router;
