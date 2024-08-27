const express = require("express");
const router = express.Router();
const {
  getStatMagasin,
  getAllServicesStat,
  getAllStoresStat,
  getBookingStat,
  getGenderStats,
} = require("../controllers/StatController");

router.get("/gender/", getGenderStats)
// Endpoint pour récupérer toutes les statistiques des magasins
router.get("/:idMagas/bookingStat", getBookingStat);
// Endpoint pour récupérer toutes les statistiques des services
router.get("/:idMag/services", getAllServicesStat);

// Endpoint pour récupérer tous les stores d'un magasin spécifique
router.get("/:idMagasin/stores", getAllStoresStat);

// Endpoint pour récupérer les statistiques d'un magasin spécifique
router.get("/:id", getStatMagasin);



module.exports = router;
