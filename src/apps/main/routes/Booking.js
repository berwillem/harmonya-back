const express = require("express");
const router = express.Router({ mergeParams: true });
const BookingRequestController = require("../controllers/BookingRequestController");

//à bloquer

router.post("/request", BookingRequestController.CreateBookingRequest);
router.post("/accept", BookingRequestController.acceptBookingRequest);
router.delete("/:id", BookingRequestController.deleteBookingRequest);
router.post("/decline", BookingRequestController.declineBookingRequest);
router.get("/user/:userId", BookingRequestController.getBookingRequestsByUser);
router.put("/:id", BookingRequestController.updateBookingRequest);

module.exports = router;
