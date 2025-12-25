const mongoose = require("mongoose");

const userPromoUsageSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  promo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Promo",
    required: true
  },
  used_at: {
    type: Date,
    default: Date.now
  },
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    default: null,
  }
}, {
  timestamps: true
});

// Index unik: satu user hanya boleh pakai satu promo sekali
userPromoUsageSchema.index({ user_id: 1, promo_id: 1 }, { unique: true });

module.exports = mongoose.model("UserPromoUsage", userPromoUsageSchema);