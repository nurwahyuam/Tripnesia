const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // misal smtp.gmail.com
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true kalau port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const createAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const createRefreshToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// signup
const signup = async (req, res) => {
  const { name, email, password, role, number_telephone, support } = req.body;

  try {
    const user = await User.signup(name, email, password, role, number_telephone, support);

    // Generate tokens
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Simpan refreshToken ke DB (opsional)
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token ke cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // ubah ke true kalau pakai HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        number_telephone: user.number_telephone,
        support: user.support,
      },
      accessToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Simpan refreshToken di cookie httpOnly
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // set true jika HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Refresh
const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });

    const accessToken = createAccessToken(user);
    res.json({ accessToken });
  });
};

// Logout
const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Email tidak terdaftar" });

  // Hapus OTP lama kalau ada
  await OTP.deleteMany({ email });

  // Buat OTP baru
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

  await OTP.create({ email, code, expiresAt });

  // Kirim email
  await transporter.sendMail({
    from: `"Support Alright Reserve" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔑 Kode OTP Reset Password Anda",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; color: #333;">
      <h2 style="color: #29D9C2;">Reset Password</h2>
      <p>Halo,</p>
      <p>Kami menerima permintaan untuk mereset password akun Anda. Gunakan kode OTP berikut untuk melanjutkan proses reset password:</p>
      <div style="margin: 20px 0; text-align: center;">
        <span style="display: inline-block; background: #f4f4f4; padding: 10px 20px; 
                     font-size: 24px; font-weight: bold; letter-spacing: 4px; 
                     border: 2px dashed #29D9C2; border-radius: 8px; color: #333;">
          ${code}
        </span>
      </div>
      <p>Kode ini berlaku selama <strong>10 menit</strong>.</p>
      <p>Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 12px; color: #888;">
        Email ini dikirim otomatis oleh sistem Alright Reserve. 
        Mohon jangan membalas email ini.
      </p>
    </div>
  `,
  });

  res.json({ message: "OTP baru telah dikirim ke email Anda" });
};

const checkOTP = async (req, res) => {
  const { email, code } = req.body;

  const otp = await OTP.findOne({ email, code });
  if (!otp) return res.status(400).json({ message: "OTP salah" });
  if (otp.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: otp._id });
    return res.status(400).json({ message: "OTP sudah kadaluarsa" });
  }

  res.json({ message: "OTP berhasil" });
};

const resetPassword = async (req, res) => {
  const { email, code, password } = req.body;

  const otp = await OTP.findOne({ email, code });
  if (!otp) return res.status(400).json({ message: "OTP salah" });
  if (otp.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: otp._id });
    return res.status(400).json({ message: "OTP sudah kadaluarsa" });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await User.updateOne({ email }, { password: hash });
  await OTP.deleteMany({ email }); // hapus OTP setelah pakai

  res.json({ message: "Password berhasil diubah" });
};

module.exports = {
  signup,
  login,
  refresh,
  logout,
  forgotPassword,
  checkOTP,
  resetPassword,
};
