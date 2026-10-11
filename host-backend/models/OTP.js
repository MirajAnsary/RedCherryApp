//host-backend
// models/OTP.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ["signup", "login", "forgot-password"],
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // TTL index: auto-delete after 10 minutes
  },
});

module.exports = mongoose.model("OTP", otpSchema);
