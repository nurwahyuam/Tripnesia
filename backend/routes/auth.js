const express = require("express");
const {
  loginUser,
  signupUser,
  logoutUser,
  refreshAccessToken,
} = require("../controller/authController");

const router = express.Router();

// SIGNUP (customer, admin, driver dll -> role dikirim di body)
router.post("/signup", signupUser);

// LOGIN (multi-role auto dicek dari DB)
router.post("/login", loginUser);

// REFRESH ACCESS TOKEN
router.post("/refresh", refreshAccessToken);

// LOGOUT
router.post("/logout", logoutUser);

module.exports = router;