// models/FavoriteShip.js
const mongoose = require("mongoose");

const favoriteShipSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ship_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ship",
      required: true,
    },
    is_favorite: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index untuk mencegah duplikasi
favoriteShipSchema.index({ user_id: 1, ship_id: 1 }, { unique: true });

module.exports = mongoose.model("FavoriteShip", favoriteShipSchema);