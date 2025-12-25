const express = require("express");
const { getUsers, updateUser, deleteUser, createUser, updateUserProfile, changePassword } = require("../controller/userController");

const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL USERS (admin only)
router.get("/", verifyToken, getUsers);
// CREATE USER (admin only)
router.post("/", verifyToken, createUser);

router.put("/profile/:id", verifyToken, updateUserProfile);

router.put("/password/:id", verifyToken, changePassword); 
// UPDATE USER (admin only)
router.put("/:id", verifyToken, updateUser);
// DELETE USER (admin only)
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;
