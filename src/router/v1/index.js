const { Router } = require("express");

const MAIN_ROUTES_PATH = "../../apps/main/routes/";
const ADMIN_ROUTES_PATH = "../../apps/admin/routes/";
const EPAIMENTE_ROUTES_PATH = "../../apps/e-paiement/routes/";
const router = Router();
router.use("/auth/user", require(MAIN_ROUTES_PATH + "AuthUser"));
router.use("/auth/magasin", require(MAIN_ROUTES_PATH + "AuthMagasin"));
router.use("/user", require(MAIN_ROUTES_PATH + "User"));
router.use("/service", require(MAIN_ROUTES_PATH + "Service"));
router.use("/newsletter", require(MAIN_ROUTES_PATH + "NewsLetter"));
router.use("/stat", require(MAIN_ROUTES_PATH + "Stat"));
router.use("/categories", require(MAIN_ROUTES_PATH + "Category"));
router.use("/subscription", require(MAIN_ROUTES_PATH + "Subscription"));
router.use( "/subscriptionRequest",require(MAIN_ROUTES_PATH + "SubscriptionRequest"));
router.use("/magasin", require(MAIN_ROUTES_PATH + "Magasin"));
router.use("/bookmarks", require(MAIN_ROUTES_PATH + "Bookmarks"));
router.use("/store", require(MAIN_ROUTES_PATH + "Store"));
router.use("/boost", require(MAIN_ROUTES_PATH + "Boost"));
router.use("/booking", require(MAIN_ROUTES_PATH + "Booking"));
router.use("/employee", require(MAIN_ROUTES_PATH + "Employee"));
router.use("/agenda", require(MAIN_ROUTES_PATH + "Agenda"));
router.use("/PubManagment", require(ADMIN_ROUTES_PATH + "PubManagment"));
router.use("/alert", require(ADMIN_ROUTES_PATH + "Alert"));
router.use(
  "/PubManagmentMobil",
  require(ADMIN_ROUTES_PATH + "PubManagmentMobil")
);
router.use("/e-paiement",require(EPAIMENTE_ROUTES_PATH + "Receips"));
router.use("/statReceip",require(EPAIMENTE_ROUTES_PATH + "StatReceip"));

router.use("/notify", require(MAIN_ROUTES_PATH + "Notification"))

module.exports = router;
