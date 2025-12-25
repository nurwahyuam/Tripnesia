const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["payment_success", "payment_pending", "payment_failed", "booking_created", "booking_cancelled", "booking_expired", "promo_created"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    metadata: {
      order_id: String,
      transaction_status: String,
      fraud_status: String,
      gross_amount: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);