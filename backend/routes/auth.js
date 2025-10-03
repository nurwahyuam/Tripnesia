const express = require("express");
const {
  login,
  signup,
  logout,
  refresh,
  forgotPassword,
  checkOTP,
  resetPassword,
  getMe
} = require("../controller/authController");

const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// SIGNUP (customer, admin, driver dll -> role dikirim di body)
router.post("/signup", signup);
// LOGIN (multi-role auto dicek dari DB)
router.post("/login", login);
// REFRESH ACCESS TOKEN
router.post("/refresh", refresh);
// LOGOUT
router.post("/logout", logout);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);
router.post("/otp-check", checkOTP);
router.post("/reset-password", resetPassword);

module.exports = router;