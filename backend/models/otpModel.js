const mongoose = require("mongoose");
const validator = require("validator");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: [true, "Email wajib diisi"], lowercase: true, validate: [validator.isEmail, "Email tidak valid"] },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model("OTP", otpSchema);
