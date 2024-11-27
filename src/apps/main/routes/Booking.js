const express = require("express");
const router = express.Router({ mergeParams: true });
const BookingRequestController = require("../controllers/BookingRequestController");

//à bloquer

router.post("/request", BookingRequestController.CreateBookingRequest);
router.post("/accept", BookingRequestController.acceptBookingRequest);
router.post("/decline", BookingRequestController.declineBookingRequest);
router.delete("/:id", BookingRequestController.deleteBookingRequest);
router.put("/:id", BookingRequestController.updateBookingRequest);
router.get("/user/:userId", BookingRequestController.getBookingRequestsByUser);

module.exports = router;
