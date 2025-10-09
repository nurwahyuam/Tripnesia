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
// CREATE USER
const createUser = async (req, res) => {
  try {
    const { name, email, password, number_telephone, role, support } = req.body;
    console.log(req.body);
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
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }
    res.status(200).json({ message: 'Pengguna Berhasil Dihapus!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
