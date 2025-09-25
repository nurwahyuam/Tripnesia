const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const createRefreshToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.APP_ENV === "production",
      sameSite: process.env.APP_ENV === "production" ? "Strict" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login Berhasil",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// signup
const signupUser = async (req, res) => {
  const { name, email, password, role, number_telephone, support } = req.body;
  try {
    const user = await User.signup(name, email, password, role, number_telephone, support);

    res.status(201).json({
      message: "Pengguna berhasil terdaftar",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, number_telephone:user.number_telephone, support:user.support },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const refreshAccessToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "Tidak ada token baru" });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token baru tidak valid" });

    const newAccessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });

    res.json({ accessToken: newAccessToken });
  });
};

const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "Strict" });
  res.json({ message: "Keluar" });
};

module.exports = { loginUser, signupUser, logoutUser, refreshAccessToken };
