const express = require("express")
const router = express.Router({mergeParams:true})
const ReceipController = require("../controllers/ReceipController")

router.post("/:IdMagasain",ReceipController.addReceip );
router.get("/:IdMagasain",ReceipController.getReceipsByMagasain );

module.exports = router