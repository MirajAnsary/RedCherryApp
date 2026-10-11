//host-backend
// services/otpService.js
const twilio = require("twilio");
const bcrypt = require("bcryptjs");
const OTP = require("../models/OTP");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

/**
 * Generate & send a 6-digit OTP via Twilio SMS
 * Stores a bcrypt-hashed version in DB
 */
async function sendOTP(phoneNumber, countryCode = "+91", purpose = "signup") {
  // Delete any existing OTP for this phone + purpose
  await OTP.deleteMany({ phoneNumber, purpose });

  // Generate 6-digit OTP
  const rawOtp = String(Math.floor(100000 + Math.random() * 900000));

  // Hash before storing
  const hashedOtp = await bcrypt.hash(rawOtp, 10);

  // Save to DB
  await OTP.create({
    phoneNumber,
    otp: hashedOtp,
    purpose,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  const fullPhone = `${countryCode}${phoneNumber}`;

  // Send via Twilio
  try {
    await client.messages.create({
      body: `Your Red Cherry (Host) verification code is: ${rawOtp}. Valid for 5 minutes. Do not share this code.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: fullPhone,
    });
  } catch (twilioErr) {
    console.error("Twilio error:", twilioErr.message);
    // In development, log OTP to console as fallback
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV OTP for ${fullPhone}]: ${rawOtp}`);
    }
    throw new Error("Failed to send OTP. Please try again.");
  }

  // Return masked phone for UI display
  const masked =
    countryCode + phoneNumber.slice(0, 2) + "****" + phoneNumber.slice(-2);

  return { masked };
}

/**
 * Verify OTP submitted by user
 * Returns true if valid, throws on failure
 */
async function verifyOTP(phoneNumber, submittedOtp, purpose = "signup") {
  const record = await OTP.findOne({ phoneNumber, purpose, verified: false });

  if (!record) {
    throw new Error("OTP not found or already used. Please request a new one.");
  }

  if (record.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: record._id });
    throw new Error("OTP has expired. Please request a new one.");
  }

  if (record.attempts >= 3) {
    await OTP.deleteOne({ _id: record._id });
    throw new Error("Too many failed attempts. Please request a new OTP.");
  }

  const isMatch = await bcrypt.compare(submittedOtp, record.otp);

  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    const remaining = 3 - record.attempts;
    throw new Error(
      `Incorrect OTP. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : "No attempts left. Request a new OTP."}`,
    );
  }

  // Mark as verified and delete
  await OTP.deleteOne({ _id: record._id });
  return true;
}

module.exports = { sendOTP, verifyOTP };
