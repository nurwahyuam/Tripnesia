const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/ship/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "ship-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploud = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  file: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

module.exports = uploud;
