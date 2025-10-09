const express = require("express");
const {

} = require("../controller/shipController");

const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL USERS (admin only)
router.get("/", verifyToken, getShips);
// CREATE USER (admin only)
router.post("/", verifyToken, createShip);
// UPDATE USER (admin only)
router.put("/:id", verifyToken, updateShip);
// DELETE USER (admin only)
router.delete("/:id", verifyToken, deleteShip);

module.exports = router;
