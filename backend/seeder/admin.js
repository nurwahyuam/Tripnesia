const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");

dotenv.config();

mongoose
  .connect(process.env.MONG_URL)

const createRefreshToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("✅ Admin sudah ada, tidak perlu dibuat ulang.");
      process.exit();
    }

    
    const user = await User.signup(
      "Admin", // name
      "admin@gmail.com", // email
      "12345678", // password (akan di-hash)
      "admin", // role
      "08123456789", // number_telephone
      true // support
    );

    const refreshToken = createRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    
    console.log("✅ Admin berhasil dibuat!");
    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedAdmin();

module.exports = seedAdmin;