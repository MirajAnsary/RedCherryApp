// user-backend/models/ManualRecharge.js

const mongoose = require("mongoose");

const manualRechargeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be at least ₹1"],
    },
    utrNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{12}$/, "UTR must be exactly 12 digits"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    adminNote: {
      type: String,
      default: "",
      trim: true,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ManualRecharge", manualRechargeSchema);
