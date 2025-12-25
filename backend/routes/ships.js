const express = require("express");
const { getShips, getPublicShips, getShipById, getPublicShipBySlug, createShip, updateShip, deleteShip } = require("../controller/shipController");

const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploudShipMiddleware");

const router = express.Router();

// GET ALL USERS (admin only)
router.get("/public",  getPublicShips);
router.get("/customer", verifyToken, getShips);
// GET SINGLE USER (admin only)
router.get("/:id", verifyToken, getShipById);
router.get("/public/:slug", getPublicShipBySlug);
router.get("/customer/:slug", verifyToken, getPublicShipBySlug);
router.post("/", verifyToken, upload.any(), createShip);
router.put("/:id", verifyToken, upload.any(), updateShip);
// DELETE USER (admin only)
router.delete("/:id", verifyToken, deleteShip);

module.exports = router;
