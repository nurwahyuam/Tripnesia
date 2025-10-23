// models/BookingCabin.js
const mongoose = require('mongoose');

const bookingCabinSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  cabin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cabin',
    required: true,
  },
  pax: {
    type: Number,
    required: true,
  },
  pax_under_five_year: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('BookingCabin', bookingCabinSchema);