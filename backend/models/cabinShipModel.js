const mongoose = require("mongoose");

const cabinSchema = new mongoose.Schema(
  {
    ship_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ship",
      required: true,
    },
    date_start: {
      type: Date,
      required: true,
    },
    date_end: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    pax: {
      type: Number,
    },
    bed: {
      type: String,
    },
    other: {
      type: [
        {
          key: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
      default: [],
    },
    price: {
      type: String,
    },
  },
  { timestamps: true }
);

cabinSchema.virtual("images", {
  ref: "ImagesCabin",
  localField: "_id",
  foreignField: "cabin_id",
  justOne: false,
});

module.exports = mongoose.model("Cabin", cabinSchema);
