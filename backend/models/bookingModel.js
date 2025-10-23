// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ship_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ship',
    required: true,
  },
  promo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promo',
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'completed', 'rejected'],
    default: 'pending',
  },
  total_price: {
    type: Number,
    required: true,
  },
  expired_at: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true, // menambahkan createdAt & updatedAt
});

// Index untuk expired_at agar cron job lebih cepat
bookingSchema.index({ expired_at: 1 });

module.exports = mongoose.model('Booking', bookingSchema);