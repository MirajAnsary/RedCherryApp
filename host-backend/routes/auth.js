//host-backend
// routes/auth.js
const express = require("express");
const router = express.Router();
const {
  sendOTPHandler,
  signup,
  verifySignupOTP,
  login,
  verifyLoginOTP,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
  getMe,
  googleAuth,
  googleComplete,
} = require("../controllers/authController");
const verifyHostToken = require("../middleware/verifyHostToken");

// ── Public routes ──────────────────────────────────────────────────────────
router.post("/send-otp", sendOTPHandler);
router.post("/signup", signup);
router.post("/verify-signup-otp", verifySignupOTP);
router.post("/login", login);
router.post("/verify-login-otp", verifyLoginOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/google", googleAuth);
router.post("/google/complete", googleComplete);

// ── Protected routes ───────────────────────────────────────────────────────
router.get("/me", verifyHostToken, getMe);

module.exports = router;
