////host-backend
// controllers/authController.js
const Host = require("../models/Host");
const { sendOTP, verifyOTP } = require("../services/otpService");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
} = require("../services/tokenService");

/* ─────────────────────────────────────────────────────────────────────────
   POST /api/host/auth/send-otp
   Body: { phoneNumber, countryCode?, purpose }
───────────────────────────────────────────────────────────────────────── */
async function sendOTPHandler(req, res) {
  try {
    const { phoneNumber, countryCode = "+91", purpose = "signup" } = req.body;

    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Valid 10-digit phone number required.",
      });
    }

    const { masked } = await sendOTP(phoneNumber, countryCode, purpose);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
      maskedPhone: masked,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   POST /api/host/auth/signup
   Body: { firstName, lastName, phoneNumber, countryCode?, gender, age, password, confirmPassword }
   Step 1: Validates, creates unverified account, sends OTP
───────────────────────────────────────────────────────────────────────── */
async function signup(req, res) {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      countryCode = "+91",
      gender,
      age,
      password,
      confirmPassword,
    } = req.body;

    if (!firstName?.trim())
      return res
        .status(400)
        .json({ success: false, message: "First name is required." });
    if (!lastName?.trim())
      return res
        .status(400)
        .json({ success: false, message: "Last name is required." });
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber))
      return res.status(400).json({
        success: false,
        message: "Valid 10-digit phone number required.",
      });
    if (!password || password.length < 6)
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match." });

    const existing = await Host.findOne({ phoneNumber });
    if (existing) {
      if (existing.isVerified) {
        return res.status(409).json({
          success: false,
          message: "This phone number is already registered. Please sign in.",
        });
      }
      await Host.deleteOne({ _id: existing._id });
    }

    const host = new Host({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber,
      countryCode,
      gender,
      age: age ? Number(age) : undefined,
      password,
      isVerified: false,
    });
    await host.save();

    const { masked } = await sendOTP(phoneNumber, countryCode, "signup");

    return res.status(200).json({
      success: true,
      message: "OTP sent. Please verify to complete signup.",
      maskedPhone: masked,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   POST /api/host/auth/verify-signup-otp
   Body: { phoneNumber, otp }
   Verifies OTP and activates account — issues JWT tokens
───────────────────────────────────────────────────────────────────────── */
async function verifySignupOTP(req, res) {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required.",
      });
    }

    await verifyOTP(phoneNumber, otp, "signup");

    const host = await Host.findOne({ phoneNumber });
    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host account not found. Please sign up again.",
      });
    }

    host.isVerified = true;

    const accessToken = generateAccessToken(host);
    const refreshToken = generateRefreshToken(host);
    host.refreshToken = refreshToken;
    await host.save();

    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      success: true,
      message: "Account verified successfully! Welcome to Red Cherry.",
      accessToken,
      user: host.toPublicProfile(),
    });
  } catch (err) {
    console.error("Verify signup OTP error:", err);
    return res.status(400).json({ success: false, message: err.message });
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   POST /api/host/auth/login
   Body: { phoneNumber, password }
   ✅ FIXED: Validates credentials and issues tokens DIRECTLY — no OTP needed
───────────────────────────────────────────────────────────────────────── */
async function login(req, res) {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Valid 10-digit phone number required.",
      });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required." });
    }

    const host = await Host.findOne({ phoneNumber });
    if (!host) {
      return res.status(401).json({
        success: false,
        message: "No account found with this phone number.",
      });
    }

    // If account not verified, send signup OTP instead
    if (!host.isVerified) {
      const { masked } = await sendOTP(phoneNumber, host.countryCode, "signup");
      return res.status(403).json({
        success: false,
        message: "Account not verified. A new OTP has been sent.",
        needsVerification: true,
        maskedPhone: masked,
      });
    }

    const isMatch = await host.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    // ✅ Issue tokens directly — no OTP step
    const accessToken = generateAccessToken(host);
    const refreshToken = generateRefreshToken(host);
    host.refreshToken = refreshToken;
    await host.save();

    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Signed in successfully!",
      accessToken,
      user: host.toPublicProfile(),
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   POST /api/host/auth/verify-login-otp  (kept for backwards compat, unused)
───────────────────────────────────────────────────────────────────────── */
async function verifyLoginOTP(req, res) {
  return res.status(410).json({
    success: false,
    message:
      "Login OTP verification is no longer required. Please use /login directly.",
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   POST /api/host/auth/forgot-password
   Body: { phoneNumber }
───────────────────────────────────────────────────────────────────────── */
async function forgotPassword(req, res) {
  try {
    const { phoneNumber, countryCode = "+91" } = req.body;

    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Valid 10-digit phone number required.",
      });
    }

    const host = await Host.findOne({ phoneNumber });
    if (!host) {
      return res.status(404).json({
        success: false,
        message: "No account found with this phone number.",
      });
    }

    const { masked } = await sendOTP(
      phoneNumber,
      host.countryCode,
      "forgot-password",
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent for password reset.",
      maskedPhone: masked,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   POST /api/host/auth/reset-password
   Body: { phoneNumber, otp, newPassword, confirmPassword }
───────────────────────────────────────────────────────────────────────── */
async function resetPassword(req, res) {
  try {
    const { phoneNumber, otp, newPassword, confirmPassword } = req.body;

    if (!phoneNumber || !otp || !newPassword)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    if (newPassword.length < 6)
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    if (newPassword !== confirmPassword)
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match." });

    await verifyOTP(phoneNumber, otp, "forgot-password");

    const host = await Host.findOne({ phoneNumber });
    if (!host)
      return res
        .status(404)
        .json({ success: false, message: "Host not found." });

    host.password = newPassword;
    host.refreshToken = null;
    await host.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. Please sign in with your new password.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(400).json({ success: false, message: err.message });
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   POST /api/host/auth/refresh-token
───────────────────────────────────────────────────────────────────────── */
async function refreshToken(req, res) {
  try {
    const token = req.cookies?.rc_refresh_token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token missing." });
    }

    const decoded = verifyRefreshToken(token);

    const host = await Host.findById(decoded.id);
    if (!host || host.refreshToken !== token) {
      clearRefreshCookie(res);
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token. Please sign in again.",
      });
    }

    const newAccessToken = generateAccessToken(host);
    const newRefreshToken = generateRefreshToken(host);
    host.refreshToken = newRefreshToken;
    await host.save();

    setRefreshCookie(res, newRefreshToken);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    clearRefreshCookie(res);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired refresh token." });
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   POST /api/host/auth/logout
───────────────────────────────────────────────────────────────────────── */
async function logout(req, res) {
  try {
    const token = req.cookies?.rc_refresh_token;
    if (token) {
      try {
        const decoded = verifyRefreshToken(token);
        await Host.findByIdAndUpdate(decoded.id, { refreshToken: null });
      } catch {
        // Token already invalid — fine
      }
    }
    clearRefreshCookie(res);
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    clearRefreshCookie(res);
    return res.status(200).json({ success: true, message: "Logged out." });
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   GET /api/host/auth/me
───────────────────────────────────────────────────────────────────────── */
async function getMe(req, res) {
  return res.status(200).json({
    success: true,
    user: req.hostUser.toPublicProfile(),
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   POST /api/host/auth/google            Body: { idToken }
   POST /api/host/auth/google/complete   Body: { googleToken, phoneNumber }
   Sign in with Google (Firebase). Existing hosts (matched by Google UID or
   email) get tokens directly. New hosts get { needsPhone, googleToken }, then
   /google/complete creates the account and logs in directly — Google already
   verified the host, so no phone OTP (OTP is only for phone signups).
───────────────────────────────────────────────────────────────────────── */
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { verifyFirebaseIdToken } = require("../config/firebaseAdmin");

const GOOGLE_SIGNUP_SECRET =
  (process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET) + "_google";

function splitName(name = "") {
  const [first, ...rest] = name.trim().split(/\s+/);
  return { firstName: first || "Host", lastName: rest.join(" ") || "-" };
}

async function googleAuth(req, res) {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res
        .status(400)
        .json({ success: false, message: "Google token is required." });
    }

    let decoded;
    try {
      decoded = await verifyFirebaseIdToken(idToken);
    } catch (err) {
      console.error("Google token verify failed:", err.message);
      return res
        .status(401)
        .json({ success: false, message: "Google sign-in failed. Try again." });
    }

    const email = decoded.email_verified ? decoded.email.toLowerCase() : null;
    let host = await Host.findOne({ googleId: decoded.uid });
    if (!host && email) host = await Host.findOne({ email });

    if (!host) {
      const googleToken = jwt.sign(
        { uid: decoded.uid, email, name: decoded.name || "" },
        GOOGLE_SIGNUP_SECRET,
        { expiresIn: "15m" },
      );
      return res.status(200).json({
        success: true,
        needsPhone: true,
        googleToken,
        name: decoded.name || "",
        email,
      });
    }

    if (!host.googleId) host.googleId = decoded.uid;
    if (!host.email && email) host.email = email;

    host.isVerified = true; // verified by Google

    const accessToken = generateAccessToken(host);
    const refreshToken = generateRefreshToken(host);
    host.refreshToken = refreshToken;
    await host.save();

    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Signed in successfully!",
      accessToken,
      user: host.toPublicProfile(),
    });
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function googleComplete(req, res) {
  try {
    const { googleToken, phoneNumber, countryCode = "+91" } = req.body;

    let g;
    try {
      g = jwt.verify(googleToken, GOOGLE_SIGNUP_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Google session expired. Please sign in with Google again.",
      });
    }

    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Valid 10-digit phone number required.",
      });
    }

    const existing = await Host.findOne({ phoneNumber });
    if (existing) {
      if (existing.isVerified) {
        return res.status(409).json({
          success: false,
          message:
            "This phone number is already registered. Sign in with your phone and password.",
        });
      }
      await Host.deleteOne({ _id: existing._id });
    }

    const { firstName, lastName } = splitName(g.name);
    const host = new Host({
      firstName,
      lastName,
      phoneNumber,
      countryCode,
      email: g.email,
      googleId: g.uid,
      // Google accounts sign in without a password; "Forgot Password" sets one
      password: crypto.randomBytes(24).toString("hex"),
      isVerified: true, // verified by Google — no OTP
    });

    const accessToken = generateAccessToken(host);
    const refreshToken = generateRefreshToken(host);
    host.refreshToken = refreshToken;
    await host.save();

    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      success: true,
      message: "Welcome to Red Cherry!",
      accessToken,
      user: host.toPublicProfile(),
    });
  } catch (err) {
    console.error("Google complete error:", err);
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This Google account or phone is already registered.",
      });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
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
};
