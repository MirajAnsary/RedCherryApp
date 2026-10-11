// user-backend/models/Grievance.js
const mongoose = require("mongoose");

const VALID_CATEGORIES = [
  "Objection to Content",
  "Nudity / Pornography",
  "Judicial Order",
  "Privacy",
  "Impersonation",
];

const grievanceSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true, default: "" },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    appUserId: { type: String, trim: true, default: "" },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ✅ FIXED: correct Mongoose syntax for array-of-strings with enum
    categories: {
      type: [{ type: String, enum: VALID_CATEGORIES }],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one category is required.",
      },
    },

    description: { type: String, required: true, trim: true },
    evidenceFile: { type: String, default: null },
    evidenceOriginalName: { type: String, default: null },
    affirmed: { type: Boolean, required: true },

    status: {
      type: String,
      enum: ["pending", "under_review", "resolved", "rejected"],
      default: "pending",
    },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Grievance", grievanceSchema);
