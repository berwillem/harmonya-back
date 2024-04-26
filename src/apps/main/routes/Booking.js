const express = require("express")
const router = express.Router({mergeParams:true})
const BookingRequestController = require("../controllers/BookingRequestController")

//à bloquer

router.post("/request", BookingRequestController.CreateBookingRequest);
router.post("/accept", BookingRequestController.acceptBookingRequest)

module.exports = router