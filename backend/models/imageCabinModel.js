const mongoose = require('mongoose');

const imagesCabinSchema = new mongoose.Schema(
  {
    cabin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cabin",
      required: true,
    },
    image_cabin_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ImagesCabin', imagesCabinSchema);
