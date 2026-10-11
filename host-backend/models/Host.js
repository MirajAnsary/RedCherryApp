//host-backend
// models/Host.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const hostSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Phone must be 10 digits"],
    },
    countryCode: { type: String, default: "+91" },
    email: { type: String, lowercase: true, trim: true, default: null },
    // Firebase UID — set when the account signs in with Google
    googleId: { type: String, unique: true, sparse: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    age: { type: Number, min: 18, max: 120 },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: "host", immutable: true },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },
    refreshTokenBlacklist: { type: [String], default: [] },

    // ── Profile extras ─────────────────────────────────────────────
    profileImage: { type: String, default: null },
    location: { type: String, default: null },
    earnings: { type: Number, default: 0 },

    // ── Media ──────────────────────────────────────────────────────
    images: [
      {
        url: { type: String },
        publicId: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    introVideo: { type: String, default: null },
    auditionVideo: { type: String, default: null },

    // ── KYC ────────────────────────────────────────────────────────
    kyc: {
      status: {
        type: String,
        enum: ["pending", "submitted", "verified", "rejected"],
        default: "pending",
      },
      aadhaarFront: { type: String, default: null },
      aadhaarBack: { type: String, default: null },
      voterFront: { type: String, default: null },
      voterBack: { type: String, default: null },
      submittedAt: { type: Date, default: null },
    },

    // ── Bank ───────────────────────────────────────────────────────
    bank: {
      accountHolderName: { type: String, default: null },
      accountNumber: { type: String, default: null },
      ifscCode: { type: String, default: null },
      bankName: { type: String, default: null },
      addedAt: { type: Date, default: null },
    },
  },
  { timestamps: true },
);

hostSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

hostSchema.methods.comparePassword = async function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

hostSchema.methods.toPublicProfile = function () {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    phoneNumber: this.phoneNumber,
    countryCode: this.countryCode,
    gender: this.gender,
    age: this.age,
    role: this.role,
    isVerified: this.isVerified,
    profileImage: this.profileImage,
    location: this.location,
    earnings: this.earnings,
    kyc: { status: this.kyc?.status || "pending" },
    bank: { hasBank: !!this.bank?.accountNumber },
  };
};

// Collection name "RedCherryHost" is correct — this is where host documents
// are physically stored inside the RedCherryHost database.
// DO NOT change this to "hosts" — that collection does not exist.
module.exports = mongoose.model("Host", hostSchema, "RedCherryHost");
