const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// =======================
// Middleware verify token
// =======================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: "Token tidak ditemukan" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token tidak valid atau expired" });

    req.user = decoded; // simpan user info dari token { id, role }
    next();
  });
};

// =======================
// Middleware check role
// =======================
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Akses ditolak, hanya untuk admin" });
  }
  next();
};

const isCustomer = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ error: "Akses ditolak, hanya untuk customer" });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isCustomer
}
