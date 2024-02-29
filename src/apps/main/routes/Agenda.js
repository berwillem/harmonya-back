const express = require("express")
const router = express.Router({mergeParams:true})
const AgendaController = require("../controllers/AgendaController")

router.post("/", AgendaController.createAgendaAPI);

module.exports = router