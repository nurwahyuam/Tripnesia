// src/models/SpecificationShip.js
const mongoose = require('mongoose');

const specSchema = new mongoose.Schema({
  ship_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ship',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('SpecificationShip', specSchema);