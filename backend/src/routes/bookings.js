const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  createBooking,
  getBookings,
  getAvailableSlots,
  updateBookingStatus,
  getBookingById,
  getCalendarBookings,
} = require('../controllers/bookingController');

const router = express.Router();

// Public — check availability
router.get('/available', getAvailableSlots);

// Protected — all authenticated users
router.use(authenticate);
router.get('/calendar', getCalendarBookings);
router.post('/', authorize('CUSTOMER'), createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
