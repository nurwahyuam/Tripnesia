const multer = require("multer");
const path = require("path");
const uploud = require("./uploudShipMiddleware");

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cabins/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `cabin-${uniqueSuffix}${ext}`);
  },
});

// Filter file (hanya gambar)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diperbolehkan."));
  }
};

const uploadSingle = multer({ storage, fileFilter }).single("image");
const uploadMultiple = multer({ storage, fileFilter }).array("images", 10);

module.exports = { uploadSingle, uploadMultiple };
