const express = require("express");
const bookingValidationRules = require("../../validators/bookingValidation");
const { verifyToken } = require("../../middleware/jwt.middleware");
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getUserBookings,
} = require("../../controllers/v1/Booking.Controller");

const router = express.Router();

// POST route to create a new booking
router.post("/bookings", verifyToken, bookingValidationRules, createBooking);

// GET route to fetch all bookings
router.get("/bookings", verifyToken, getAllBookings);

// GET route to fetch a booking by ID
// router.get('/booking/:id',authMiddleware, getBookingById);
router.get("/bookings/:id", verifyToken, getBookingById);

// PUT route to update a booking by ID
// router.put('/booking/:id',authMiddleware, bookingValidationRules, updateBooking);
router.put("/bookings/:id", verifyToken, bookingValidationRules, updateBooking);

// DELETE route to delete a booking by ID
router.delete("/bookings/:id", verifyToken, deleteBooking);

// Route to get all bookings for the current user
router.get("/my-bookings", verifyToken, getUserBookings);

// Export the router
module.exports = router;
