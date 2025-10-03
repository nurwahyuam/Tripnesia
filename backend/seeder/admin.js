const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");

dotenv.config();

mongoose
  .connect(process.env.MONG_URL)

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("✅ Admin sudah ada, tidak perlu dibuat ulang.");
      process.exit();
    }

    await User.signup(
      "Admin", // name
      "admin@gmail.com", // email
      "12345678", // password (akan di-hash)
      "admin", // role
      "08123456789", // number_telephone
      true // support
    );
    console.log("✅ Admin berhasil dibuat!");
    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedAdmin();

module.exports = seedAdmin;