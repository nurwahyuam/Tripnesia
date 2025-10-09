// src/models/ImagesShip.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  ship_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ship',
    required: true,
  },
  image_ship_url: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ImagesShip', imageSchema);