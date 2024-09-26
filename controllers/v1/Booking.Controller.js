const { validationResult } = require("express-validator");
const BookingModel = require("../../models/v1/Booking.Model");

// Create a new booking
const createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array().map((err) => err.msg) });
  }
  const newBooking = new BookingModel(req.body);

  try {
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// role based Get a booking by ID
// const getBookingById = async (req, res) => {
//     const { id } = req.params;
//     // const currentUserEmail = req.user.email;

//     try {
//         // Check if the user is admin
//         const isAdmin = req.user.userType === 'admin';

//         let booking;

//         if (isAdmin) {
//             // Admin can fetch any booking
//             booking = await Booking.findById(id);
//             if (!booking) {
//                 return res.status(404).json({ message: 'Booking not found' });
//             }
//         } else {
//             // User can only fetch their own booking
//             booking = await Booking.findOne({ _id: id });
//             if (!booking) {
//                 return res.status(404).json({ message: 'Booking not found or access denied' });
//             }
//         }

//         res.status(200).json(booking);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const getBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch booking by ID
    const booking = await BookingModel.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a booking by ID
// const updateBooking = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array().map(err => err.msg) });
//     }

//     const { id } = req.params;

//     try {
//         const updatedBooking = await Booking.findByIdAndUpdate(
//             id,
//             { ...req.body, updatedAt: Date.now() },
//             { new: true }
//         );

//         if (!updatedBooking) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }

//         res.status(200).json(updatedBooking);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

/* ****************************** */

// Update a booking by ID
// const updateBooking = async (req, res) => {
//     const { id } = req.params;
//     const { email, userType } = req.user;

//     try {
//         const booking = await Booking.findById(id);
//         if (!booking) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }

//         // Check if user is an admin or trying to update their own booking
//         if (userType !== 'admin' && booking.email !== email) {
//             return res.status(403).json({ message: 'You can only update your own bookings' });
//         }

//         const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
//         res.status(200).json(updatedBooking);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

const updateBooking = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the booking by ID
    const booking = await BookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the booking with the new data
    const updatedBooking = await BookingModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // Return the updated booking
    return res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error); // Log error for debugging
    return res.status(400).json({ error: error.message });
  }
};

// // role based  Delete a booking by ID
// const deleteBooking = async (req, res) => {
//     const { id } = req.params;
//     const { userType } = req.user;

//     try {
//         const booking = await Booking.findById(id);
//         if (!booking) {
//             return res.status(404).json({ message: 'Booking not found' });
//         }

//         const currentTime = new Date();
//         const bookingTime = new Date(booking.createdAt);
//         const hoursSinceBooking = (currentTime - bookingTime) / (1000 * 60 * 60);

//         if (userType !== 'admin' && hoursSinceBooking > 24) {
//             return res.status(403).json({ message: 'You can only delete bookings within 24 hours of creation' });
//         }

//         await Booking.findByIdAndDelete(id);
//         res.status(200).json({ message: 'Booking deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// Delete a booking by ID

const deleteBooking = async (req, res) => {
  const { id } = req.params;
  const { userType } = req.user;

  try {
    const booking = await BookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const currentTime = new Date();
    const bookingTime = new Date(booking.createdAt);
    const minutesSinceBooking = (currentTime - bookingTime) / (1000 * 60);

    if (userType !== "admin" && minutesSinceBooking > 1) {
      return res.status(403).json({
        message: "You can only delete bookings within 1 minute of creation",
      });
    }

    await BookingModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // role based  Get all bookings associated with the current user
// const getUserBookings = async (req, res) => {
//     const { userId, userType } = req.user;

//     try {
//         let bookings;
//         if (userType === 'admin') {
//             // If the user is an admin, return all bookings
//             bookings = await Booking.find();
//         } else {
//             // If the user is a regular user, return only their bookings
//             bookings = await Booking.find({ userId });
//         }
//         res.status(200).json(bookings);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// Get all bookings for admin or bookings associated with the current user's email

const getUserBookings = async (req, res) => {
  const { email, userType } = req.user;

  try {
    let bookings;
    // if (userType === "admin") {
    //   // If the user is an admin, return all bookings
    //   bookings = await BookingModel.find();
    // } else {
    //   // If the user is a regular user, return only their bookings based on email
    //   bookings = await BookingModel.find({ email });
    // }
    bookings = await BookingModel.find({ email });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export all controller functions
module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getUserBookings,
};
