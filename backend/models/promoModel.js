const mongoose = require("mongoose");

const promoSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    discount_value: { type: Number, required: true }, // bisa persen (20) atau harga (50000)
    discount_type: { type: String, enum: ["percentage", "fixed"], required: true },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    status: { // diganti dari is_active ke status
      type: Boolean,
      default: true,
    },
    user_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      default: null 
    },
    min_pax: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Promo", promoSchema);