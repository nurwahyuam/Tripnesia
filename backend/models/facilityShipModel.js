const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  ship_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ship',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('FacilityShip', facilitySchema);