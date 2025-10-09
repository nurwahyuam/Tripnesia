// src/models/PlanDays.js
const mongoose = require('mongoose');

const planDaysSchema = new mongoose.Schema({
  plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule', // karena terhubung ke schedule
    required: true,
  },
  day: {
    type: Number,
    required: true,
    min: 1,
  },
  plans: {
    type: Object, // bisa jadi array of objects, sesuaikan struktur
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('PlanDays', planDaysSchema);