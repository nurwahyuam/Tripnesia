const mongoose = require('mongoose');

const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // hapus karakter non-alphanumeric
    .replace(/\s+/g, '-')          // ganti spasi dengan -
    .replace(/-+/g, '-');          // hindari double dash
};

const shipSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['private trip', 'open trip'],
    required: true,
  },
  class: {
    type: String,
    enum: ['standard', 'superior', 'deluxe', 'luxury'],
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
    unique: true,
    index: true,
  },
}, {
  timestamps: true,
});

shipSchema.post('save', async function(doc) {
  if (doc.slug) return;

  const typeSlug = slugify(doc.type);
  const nameSlug = slugify(doc.name);
  const classSlug = doc.class;
  const min = doc.min_pax;
  const max = doc.max_pax;
  const id = doc._id.toString();

  const newSlug = `${nameSlug}-${typeSlug}-${min}-to-${max}-person-${classSlug}-${id}`;

  await doc.constructor.updateOne({ _id: doc._id }, { slug: newSlug });
});

module.exports = mongoose.model('Ship', shipSchema);