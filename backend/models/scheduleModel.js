const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  ship_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ship',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Schedule', scheduleSchema);