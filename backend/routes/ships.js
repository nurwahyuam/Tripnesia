const express = require("express");
const { getShips, getShipById, createShip, updateShip, deleteShip } = require("../controller/shipController");

const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploudMiddleware");

const router = express.Router();

// GET ALL USERS (admin only)
router.get("/", verifyToken, getShips);
// GET SINGLE USER (admin only)
router.get("/:id", verifyToken, getShipById);
router.post(
  "/",
  verifyToken,
  upload.any(),
  createShip
);
router.put(
  "/:id",
  verifyToken,
  upload.any(),
  updateShip
);
// DELETE USER (admin only)
router.delete("/:id", verifyToken, deleteShip);

module.exports = router;
