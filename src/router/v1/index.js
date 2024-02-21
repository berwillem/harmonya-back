const { Router } = require("express");

const ROUTES_PATH = "../../apps/main/routes/";

const router = Router();
router.use("/auth/user", require(ROUTES_PATH + "AuthUser"));
router.use("/auth/magasin", require(ROUTES_PATH + "AuthMagasin"));
router.use("/user", require(ROUTES_PATH + "User"));
router.use("/service", require(ROUTES_PATH + "Service"));
router.use("/newsletter", require(ROUTES_PATH + "NewsLetter"));
router.use("/categories", require(ROUTES_PATH + "Category"));
router.use("/subscription", require(ROUTES_PATH + "Subscription"));
router.use("/magasin", require(ROUTES_PATH + "Magasin"));
router.use("/bookmarks", require(ROUTES_PATH + "Bookmarks"));
router.use("/store", require(ROUTES_PATH + "Store"));
router.use("/boost", require(ROUTES_PATH + "Boost"));

module.exports = router;
