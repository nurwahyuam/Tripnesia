const OTP = require("../models/otpModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// Contoh pakai twilio
const twilio = require("twilio");
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const forgotPassword = async (req, res) => {
  const { number_telephone } = req.body;

  const user = await User.findOne({ number_telephone });
  if (!user) return res.status(404).json({ message: "Nomor HP tidak terdaftar" });

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

  await OTP.create({ number_telephone, code, expiresAt });

  // Kirim SMS
  await client.messages.create({
    body: `Kode OTP Anda: ${code}`,
    from: process.env.TWILIO_PHONE,
    to: number_telephone,
  });

  res.json({ message: "OTP berhasil dikirim" });
};

const resetPassword = async (req, res) => {
  const { number_telephone, code, password } = req.body;

  const otp = await OTP.findOne({ number_telephone, code });
  if (!otp) return res.status(400).json({ message: "OTP salah" });
  if (otp.expiresAt < new Date()) return res.status(400).json({ message: "OTP sudah kadaluarsa" });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await User.updateOne({ number_telephone }, { password: hash });
  await OTP.deleteMany({ number_telephone }); // hapus OTP setelah pakai

  res.json({ message: "Password berhasil diubah" });
}

module.exports = {
  forgotPassword,
  resetPassword
}
