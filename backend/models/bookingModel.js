const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  ship_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ship',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  promo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promo',
    default: null
  },
  booking_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  total_price: {
    type: Number,
    required: true
  },
  personal_info: {
    title: { type: String, required: true },
    full_name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  // Tambahkan field invoice_code
  invoice_code: {
    type: String,
    required: true,
    unique: true, // Pastikan kode unik
    index: true // Tambahkan index untuk pencarian cepat
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);