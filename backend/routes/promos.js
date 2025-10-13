const express = require("express");
const {
  getPromos,
  updatePromo,
  deletePromo,
  createPromo
} = require("../controller/promoController");

const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL USERS (admin only)
router.get("/", verifyToken, getPromos);
// CREATE USER (admin only)
router.post("/", verifyToken, createPromo);
// UPDATE USER (admin only)
router.put("/:id", verifyToken, updatePromo);
// DELETE USER (admin only)
router.delete("/:id", verifyToken, deletePromo);

module.exports = router;
