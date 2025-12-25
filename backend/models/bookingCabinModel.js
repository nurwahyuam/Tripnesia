// models/BookingCabin.js
const mongoose = require('mongoose');

const bookingCabinSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  cabin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cabin',
    required: true
  },
  pax: {
    adult: { type: Number, required: true },
    child: { type: Number, required: true }
  },
  price: {
    type: Number,
    required: true
  },
  other: {
    type: Object, // Atau definisikan skema lebih spesifik jika diperlukan
    default: {}
  }
});

module.exports = mongoose.model('BookingCabin', bookingCabinSchema);