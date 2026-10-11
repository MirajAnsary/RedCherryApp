///billing for public and private
// host-backend/models/BillingSession.js
const mongoose = require("mongoose");

const billingSessionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    userName: { type: String, default: "User" },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Host",
      required: true,
      index: true,
    },
    channelName: { type: String, required: true, index: true },
    roomType: {
      type: String,
      enum: ["single", "double", "multiple"],
      required: true,
    },
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    // Rates snapshot at session start (future-proof if rates change)
    userRatePerMin: { type: Number, required: true },
    hostRatePerMin: { type: Number, required: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
    totalMinutes: { type: Number, default: 0 },
    totalUserDebit: { type: Number, default: 0 },
    totalHostEarned: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "ended", "kicked"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BillingSession", billingSessionSchema);
