const express = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser
} = require("../controller/userController");

const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL USERS (admin only)
router.get("/", verifyToken, getUsers);
// GET SINGLE USER (admin only)
router.get("/:id", verifyToken, getUser);
// CREATE USER (admin only)
router.post("/", verifyToken, createUser);
// UPDATE USER (admin only)
router.put("/:id", verifyToken, updateUser);
// DELETE USER (admin only)
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;
