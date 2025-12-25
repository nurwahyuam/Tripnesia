const express = require('express');
const router = express.Router();
const { getByAdminBookings, getUserBookings, createBooking, getBookingById, cancelBooking, checkActiveBooking, getConfirmedPaxByShip } = require('../controller/bookingController');
const { verifyToken } = require("../middleware/authMiddleware");

router.get('/admin', verifyToken, getByAdminBookings);

router.get('/', verifyToken, getUserBookings);

router.post('/', verifyToken, createBooking);

router.get('/:id', verifyToken, getBookingById);

router.patch("/:id/cancel", cancelBooking);

router.get('/customer/check-active/:shipId', verifyToken, checkActiveBooking);

router.get('/confirmed-pax/:shipId', getConfirmedPaxByShip);

module.exports = router;