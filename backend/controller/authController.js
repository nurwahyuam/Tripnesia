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
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

// signup
const signup = async (req, res) => {
  const { name, email, password, role, number_telephone, support } = req.body;

  try {
    const user = await User.signup(
      name,
      email,
      password,
      role,
      number_telephone,
      support
    );

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

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
  const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 menit

  await OTP.create({ email, code, expiresAt });

  // Kirim email
  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Kode OTP Reset Password",
    text: `Kode OTP Anda: ${code}. Berlaku 10 menit.`,
  });

  res.json({ message: "OTP telah dikirim ke email Anda" });
};

const resetPassword = async (req, res) => {
  const { email, code, password } = req.body;

  const otp = await OTP.findOne({ email, code });
  if (!otp) return res.status(400).json({ message: "OTP salah" });
  if (otp.expiresAt < new Date()) return res.status(400).json({ message: "OTP sudah kadaluarsa" });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await User.updateOne({ email }, { password: hash });
  await OTP.deleteMany({ email }); // hapus OTP setelah pakai

  res.json({ message: "Password berhasil diubah" });
}

module.exports = {
  signup,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword
}