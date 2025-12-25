const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// const getUserId = async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// CREATE USER
const createUser = async (req, res) => {
  try {
    const { name, email, password, number_telephone, role, support } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Semua Input harus wajib diisi." });
    }
    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Nama dan Email telah dibuat." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      number_telephone,
      role,
      support,
    });
    await newUser.save();
    res.status(201).json({ message: "Pengguna telah berhasil dibuat" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// UPDATE USER
const updateUser = async (req, res) => {
  try {
    const { name, email, number_telephone, password, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (name) user.name = name;
    if (email) user.email = email;
    if (number_telephone) user.number_telephone = number_telephone;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;
    await user.save();
    res.status(200).json({ message: "Pengguna Berhasil Diperbarui!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "User tidak ditemukan" });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }
    res.status(200).json({ message: "Pengguna Berhasil Dihapus!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controller/userController.js
const updateUserProfile = async (req, res) => {
  try {
    // Dapatkan user ID dari parameter route
    const userId = req.params.id;

    if (req.user.id !== userId) {
      return res.status(403).json({
        message: "You can only update your own profile",
      });
    }

    const { name, date_of_birth, greeting, no_phone, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        date_of_birth,
        greeting,
        no_phone,
        email,
      },
      { new: true, runValidators: true }
    ).select("-password"); // Jangan kembalikan password

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID format",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Verifikasi bahwa user yang login sama dengan user yang akan diupdate
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only change your own password"
      });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validasi input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required"
      });
    }

    // Validasi password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password don't match"
      });
    }

    // Validasi panjang password
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Change password error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserProfile,
  changePassword
};
