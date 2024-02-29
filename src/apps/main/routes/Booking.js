const express = require("express")
const router = express.Router({mergeParams:true})
const BookingRequestController = require("../controllers/BookingRequestController")

router.post("/request", BookingRequestController.CreateBookingRequest);