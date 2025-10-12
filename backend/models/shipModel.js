const mongoose = require("mongoose");

const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const shipSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["private trip", "open trip"],
      required: true,
    },
    merk: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      enum: ["standard", "superior", "deluxe", "luxury"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    package: {
      type: [String],
      default: [],
    },
    unpackage: {
      type: [String],
      default: [],
    },
    image_ship: {
      type: String,
      required: true,
    },
    min_pax: {
      type: Number,
      required: true,
      min: 1,
    },
    max_pax: {
      type: Number,
      required: true,
      min: 1,
    },
    slug: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Index unique sparse
shipSchema.index({ slug: 1 }, { unique: true, sparse: true });

// ✅ Pre-save hook untuk generate slug
shipSchema.pre("save", function (next) {
  if (!this.slug && this.name && this.type && this.class) {
    const typeSlug = slugify(this.type);
    const nameSlug = slugify(this.name);
    const classSlug = this.class;
    const min = this.min_pax;
    const max = this.max_pax;
    const timestamp = Date.now(); // ✅ hindari duplikat
    this.slug = `${nameSlug}-${typeSlug}-${min}-to-${max}-person-${classSlug}-${timestamp}`;
  }
  next();
});

module.exports = mongoose.model("Ship", shipSchema);