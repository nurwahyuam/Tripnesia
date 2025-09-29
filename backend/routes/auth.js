const express = require("express");
const {
  login,
  signup,
  logout,
  refresh,
  forgotPassword,
  resetPassword, 
} = require("../controller/authController");

const router = express.Router();

// SIGNUP (customer, admin, driver dll -> role dikirim di body)
router.post("/signup", signup);

// LOGIN (multi-role auto dicek dari DB)
router.post("/login", login);

// REFRESH ACCESS TOKEN
router.post("/refresh", refresh);

// LOGOUT
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;