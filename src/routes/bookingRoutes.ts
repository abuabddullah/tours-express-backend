import express from 'express';
import * as bookingController from '../controllers/bookingController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/my-bookings', bookingController.getMyBookings);
router.post('/', bookingController.createBooking);

// Admin routes
router.use(restrictTo('admin'));
router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBooking);
router.patch('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

export default router;
