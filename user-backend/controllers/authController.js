////host-backend
//controllers/authController.js
"use strict";
// controllers/authController.js  ──────────────────────────────────────────────

const path = require("path");
const fs = require("fs");

const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const {
  generateOTP,
  getOTPExpiry,
  sendOTP,
} = require("../services/smsService");

// ── Helpers ───────────────────────────────────────────────────────────────────

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// SMS failure never crashes a request; OTP is always printed to terminal
const safeSend = async (phone, countryCode, otp, purpose) => {
  try {
    await sendOTP(phone, countryCode, otp, purpose);
    return { sent: true };
  } catch (err) {
    console.error(`[authController] safeSend failed: ${err.message}`);
    return { sent: false, error: err.message };
  }
};

// ── REGISTER ──────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const {
      firstName,
      lastName,
      phoneNumber,
      countryCode = "+91",
      gender,
      age,
      password,
    } = req.body;

    const existing = await User.findOne({ phoneNumber });
    if (existing) {
      if (existing.isVerified)
        return res.status(409).json({
          success: false,
          message: "Phone already registered. Please sign in.",
        });

      // Unverified user — update details and resend OTP
      const otp = generateOTP();
      Object.assign(existing, {
        firstName,
        lastName,
        password,
        gender,
        age,
        otp: { code: otp, expiresAt: getOTPExpiry(), attempts: 0 },
      });
      await existing.save();
      const sms = await safeSend(phoneNumber, countryCode, otp, "signup");
      return res.status(200).json({
        success: true,
        message: sms.sent
          ? "OTP resent to your mobile."
          : "OTP generated — check server terminal (SMS issue).",
        maskedPhone: existing.getMaskedPhone(),
        smsDelivered: sms.sent,
        ...(process.env.NODE_ENV !== "production" &&
          !sms.sent && { smsError: sms.error }),
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      phoneNumber,
      countryCode,
      gender,
      age,
      password,
    });
    const otp = generateOTP();
    user.otp = { code: otp, expiresAt: getOTPExpiry(), attempts: 0 };
    await user.save({ validateBeforeSave: false });
    const sms = await safeSend(phoneNumber, countryCode, otp, "signup");

    return res.status(201).json({
      success: true,
      message: sms.sent
        ? "Account created! OTP sent to your mobile."
        : "Account created! OTP in server terminal (SMS issue).",
      maskedPhone: user.getMaskedPhone(),
      userId: user._id,
      smsDelivered: sms.sent,
      ...(process.env.NODE_ENV !== "production" &&
        !sms.sent && { smsError: sms.error }),
    });
  } catch (err) {
    console.error("Register Error:", err);
    if (err.code === 11000)
      return res
        .status(409)
        .json({ success: false, message: "Phone number already exists." });
    res.status(500).json({
      success: false,
      message: err.message || "Server error during registration.",
    });
  }
};

// ── VERIFY OTP (signup) ───────────────────────────────────────────────────────
exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp)
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required.",
      });

    const user = await User.findOne({ phoneNumber }).select(
      "+otp.code +otp.expiresAt +otp.attempts",
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    if (user.otp.attempts >= 5)
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Request a new OTP.",
      });
    if (!user.otp.code || !user.otp.expiresAt)
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
    if (new Date() > user.otp.expiresAt)
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    if (user.otp.code !== otp.trim()) {
      user.otp.attempts += 1;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${5 - user.otp.attempts} attempt(s) left.`,
      });
    }

    user.isVerified = true;
    user.otp = { code: null, expiresAt: null, attempts: 0 };
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Phone verified! Welcome to Red Cherry.",
      token: generateToken(user._id),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        age: user.age,
        profilePicture: user.profilePicture || null,
        isVerified: true,
        talktimeBalance: user.talktimeBalance ?? 0,
      },
    });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during OTP verification.",
    });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber }).select("+password");

    if (!user || !(await user.comparePassword(password)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid phone number or password." });
    if (!user.isActive)
      return res.status(403).json({
        success: false,
        message: "Account deactivated. Contact support.",
      });

    if (!user.isVerified) {
      const otp = generateOTP();
      user.otp = { code: otp, expiresAt: getOTPExpiry(), attempts: 0 };
      await user.save({ validateBeforeSave: false });
      const sms = await safeSend(phoneNumber, user.countryCode, otp, "signup");
      return res.status(403).json({
        success: false,
        needsVerification: true,
        message: sms.sent
          ? "Account not verified. OTP sent."
          : "Not verified. OTP in server terminal.",
        maskedPhone: user.getMaskedPhone(),
        smsDelivered: sms.sent,
      });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token: generateToken(user._id),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        age: user.age,
        profilePicture: user.profilePicture || null,
        isVerified: user.isVerified,
        talktimeBalance: user.talktimeBalance ?? 0,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error during login." });
  }
};

// ── FORGOT PASSWORD ───────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const {
      phoneNumber,
      newPassword,
      confirmPassword,
      countryCode = "+91",
    } = req.body;

    if (!phoneNumber || !newPassword || !confirmPassword)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    if (newPassword !== confirmPassword)
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match." });
    if (newPassword.length < 6)
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });

    const user = await User.findOne({ phoneNumber });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "No account found with this phone number.",
      });

    // Do NOT change the password yet — hold the hash until the OTP is verified
    const bcrypt = require("bcryptjs");
    user.pendingPassword = await bcrypt.hash(newPassword, 12);

    const otp = generateOTP();
    user.otp = { code: otp, expiresAt: getOTPExpiry(), attempts: 0 };
    await user.save({ validateBeforeSave: false });
    const sms = await safeSend(phoneNumber, countryCode, otp, "reset");

    return res.status(200).json({
      success: true,
      message: sms.sent
        ? "OTP sent to your mobile."
        : "OTP generated — check server terminal (SMS issue).",
      maskedPhone: user.getMaskedPhone(),
      smsDelivered: sms.sent,
      ...(process.env.NODE_ENV !== "production" &&
        !sms.sent && { smsError: sms.error }),
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error." });
  }
};

// ── VERIFY RESET OTP ──────────────────────────────────────────────────────────
exports.verifyResetOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp)
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required.",
      });

    const user = await User.findOne({ phoneNumber }).select(
      "+otp.code +otp.expiresAt +otp.attempts +pendingPassword",
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    if (user.otp.attempts >= 5)
      return res
        .status(429)
        .json({ success: false, message: "Too many attempts." });
    if (!user.otp.code || !user.otp.expiresAt || !user.pendingPassword)
      return res.status(400).json({
        success: false,
        message: "No reset request found. Please start again.",
      });
    if (new Date() > user.otp.expiresAt)
      return res.status(400).json({ success: false, message: "OTP expired." });
    if (user.otp.code !== String(otp).trim()) {
      user.otp.attempts += 1;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    // OTP confirmed — now apply the new (already hashed) password.
    // updateOne bypasses the pre-save hook so the hash isn't hashed again.
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password: user.pendingPassword,
          isVerified: true,
          otp: { code: null, expiresAt: null, attempts: 0 },
        },
        $unset: { pendingPassword: 1 },
      },
    );
    user.isVerified = true;

    return res.status(200).json({
      success: true,
      message: "Password reset successfully! You can now sign in.",
      token: generateToken(user._id),
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        age: user.age,
        country: user.country,
        profilePicture: user.profilePicture || null,
        isVerified: user.isVerified,
        talktimeBalance: user.talktimeBalance ?? 0,
      },
    });
  } catch (err) {
    console.error("Verify Reset OTP Error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── RESEND OTP ────────────────────────────────────────────────────────────────
exports.resendOTP = async (req, res) => {
  try {
    const { phoneNumber, countryCode = "+91" } = req.body;
    const user = await User.findOne({ phoneNumber });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    const otp = generateOTP();
    user.otp = { code: otp, expiresAt: getOTPExpiry(), attempts: 0 };
    await user.save({ validateBeforeSave: false });
    const sms = await safeSend(phoneNumber, countryCode, otp, "signup");

    return res.status(200).json({
      success: true,
      message: sms.sent
        ? "OTP resent successfully."
        : "OTP generated — check server terminal.",
      maskedPhone: user.getMaskedPhone(),
      smsDelivered: sms.sent,
    });
  } catch (err) {
    console.error("Resend OTP Error:", err);
    res.status(500).json({ success: false, message: "Failed to resend OTP." });
  }
};

// ── GET CURRENT USER ──────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phoneNumber: req.user.phoneNumber,
      email: req.user.email,
      gender: req.user.gender,
      age: req.user.age,
      country: req.user.country,
      profilePicture: req.user.profilePicture || null,
      isVerified: req.user.isVerified,
      lastLogin: req.user.lastLogin,
      createdAt: req.user.createdAt,
      talktimeBalance: req.user.talktimeBalance ?? 0,
    },
  });
};

// ── UPDATE PROFILE ────────────────────────────────────────────────────────────
//
//  Called by:  PUT /api/auth/profile
//  Middleware: protect  →  upload.single("profilePicture")  →  this handler
//
//  req.body  — text fields from multipart form (firstName, lastName, age, gender, country)
//  req.file  — uploaded file object from multer (undefined if no file was sent)
//  req.user  — populated by the protect middleware (JWT-authenticated user)
//
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // ── 1. Collect text field updates ────────────────────────────────────────
    const { firstName, lastName, age, gender, country } = req.body;

    const updates = {};

    if (firstName !== undefined && firstName.trim() !== "")
      updates.firstName = firstName.trim();

    if (lastName !== undefined && lastName.trim() !== "")
      updates.lastName = lastName.trim();

    if (age !== undefined && !isNaN(Number(age))) updates.age = Number(age);

    if (
      gender !== undefined &&
      ["Male", "Female", "Other", "Prefer not to say"].includes(gender)
    )
      updates.gender = gender;

    if (country !== undefined && country.trim() !== "")
      updates.country = country.trim();

    // ── 2. Handle profile picture upload ────────────────────────────────────
    //
    //  multer has already saved the file to disk and populated req.file.
    //  We just need to:
    //    a) Build the public URL path to store in MongoDB
    //    b) Delete the old picture from disk (optional but good practice)
    //
    if (req.file) {
      // Public URL served by express.static — matches: app.use("/uploads", express.static(...))
      updates.profilePicture = `/uploads/profiles/${req.file.filename}`;

      // Delete old profile picture from disk to avoid orphaned files
      try {
        const existingUser =
          await User.findById(userId).select("profilePicture");
        if (existingUser?.profilePicture) {
          // profilePicture is stored as "/uploads/profiles/filename.jpg"
          // Resolve it to an absolute path relative to the project root
          const oldFilePath = path.join(
            __dirname,
            "..",
            existingUser.profilePicture,
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
            console.log(`[updateProfile] Deleted old picture: ${oldFilePath}`);
          }
        }
      } catch (cleanupErr) {
        // Non-fatal — log it but don't fail the request
        console.warn(
          `[updateProfile] Could not delete old picture: ${cleanupErr.message}`,
        );
      }
    }

    // ── 3. Nothing to update? ────────────────────────────────────────────────
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update.",
      });
    }

    // ── 4. Write to MongoDB ──────────────────────────────────────────────────
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }, // new: true → return the updated document
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // ── 5. Return the updated user so the frontend can sync AuthContext ───────
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phoneNumber: updatedUser.phoneNumber,
        gender: updatedUser.gender,
        age: updatedUser.age,
        country: updatedUser.country,
        profilePicture: updatedUser.profilePicture || null,
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (err) {
    console.error("Update Profile Error:", err);

    // Multer-specific errors (wrong file type, file too large)
    if (
      err.code === "LIMIT_FILE_SIZE" ||
      err.message?.toLowerCase().includes("only") ||
      err.message?.toLowerCase().includes("image")
    ) {
      return res.status(400).json({ success: false, message: err.message });
    }

    // Mongoose validation errors (e.g. age out of range)
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors)
        .map((e) => e.message)
        .join(" ");
      return res.status(400).json({ success: false, message: messages });
    }

    res
      .status(500)
      .json({ success: false, message: "Server error updating profile." });
  }
};

// ── GOOGLE SIGN-IN (Firebase) ─────────────────────────────────────────────────
// Step 1: POST /api/auth/google  { idToken }
//   • Existing account (matched by Google UID or email) → logged in directly.
//   • New account → { needsPhone: true, googleToken } — the frontend asks for a
//     phone number and calls /google/complete.
// Step 2: POST /api/auth/google/complete  { googleToken, phoneNumber }
//   • Creates the account and logs in directly — Google already verified the
//     user, so no phone OTP (OTP is only for phone + password signups).

const crypto = require("crypto");
const { verifyFirebaseIdToken } = require("../config/firebaseAdmin");

const splitName = (name = "") => {
  const [first, ...rest] = name.trim().split(/\s+/);
  return { firstName: first || "User", lastName: rest.join(" ") || "-" };
};

const publicUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  phoneNumber: user.phoneNumber,
  email: user.email,
  gender: user.gender,
  age: user.age,
  profilePicture: user.profilePicture || null,
  isVerified: user.isVerified,
  talktimeBalance: user.talktimeBalance ?? 0,
});

exports.googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken)
      return res
        .status(400)
        .json({ success: false, message: "Google token is required." });

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
    let user = await User.findOne({ googleId: decoded.uid });
    if (!user && email) user = await User.findOne({ email });

    if (!user) {
      const googleToken = jwt.sign(
        {
          purpose: "google-signup",
          uid: decoded.uid,
          email,
          name: decoded.name || "",
        },
        process.env.JWT_SECRET,
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

    if (!user.isActive)
      return res.status(403).json({
        success: false,
        message: "Account deactivated. Contact support.",
      });

    if (!user.googleId) user.googleId = decoded.uid;
    if (!user.email && email) user.email = email;

    user.isVerified = true; // verified by Google
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token: generateToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error during Google sign-in." });
  }
};

exports.googleComplete = async (req, res) => {
  try {
    const { googleToken, phoneNumber, countryCode = "+91" } = req.body;

    let g;
    try {
      g = jwt.verify(googleToken, process.env.JWT_SECRET);
      if (g.purpose !== "google-signup") throw new Error("bad purpose");
    } catch {
      return res.status(401).json({
        success: false,
        message: "Google session expired. Please sign in with Google again.",
      });
    }

    if (!/^[6-9]\d{9}$/.test(phoneNumber || ""))
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit Indian mobile number.",
      });

    const existing = await User.findOne({ phoneNumber });
    if (existing?.isVerified)
      return res.status(409).json({
        success: false,
        message:
          "This phone number is already registered. Sign in with your phone and password.",
      });
    if (existing) await User.deleteOne({ _id: existing._id });

    const { firstName, lastName } = splitName(g.name);
    const user = new User({
      firstName,
      lastName,
      phoneNumber,
      countryCode,
      email: g.email || undefined,
      googleId: g.uid,
      // Google accounts sign in without a password; "Forgot Password" sets one
      password: crypto.randomBytes(24).toString("hex"),
      isVerified: true, // verified by Google — no OTP
      lastLogin: new Date(),
    });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Welcome to Red Cherry!",
      token: generateToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Google Complete Error:", err);
    if (err.code === 11000)
      return res.status(409).json({
        success: false,
        message: "This Google account or phone is already registered.",
      });
    res.status(500).json({
      success: false,
      message: err.message || "Server error during Google sign-up.",
    });
  }
};

// ── DELETE ACCOUNT ────────────────────────────────────────────────────────────
// DELETE /api/auth/delete-account  (protected) — permanently removes the
// logged-in user's account and their uploaded profile picture.
exports.deleteAccount = async (req, res) => {
  try {
    const user = req.user;
    if (user.profilePicture && user.profilePicture.startsWith("/uploads/")) {
      const file = path.join(__dirname, "..", user.profilePicture);
      fs.unlink(file, () => {}); // ignore if already gone
    }
    await User.deleteOne({ _id: user._id });
    return res
      .status(200)
      .json({ success: true, message: "Your account has been deleted." });
  } catch (err) {
    console.error("Delete Account Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error deleting account." });
  }
};
