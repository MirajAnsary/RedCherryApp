// host-backend/models/BillingTick.js
const mongoose = require("mongoose");

const billingTickSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BillingSession",
      required: true,
      index: true,
    },
    userId: { type: String, required: true },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Host",
      required: true,
    },
    channelName: { type: String, required: true },
    minuteNumber: { type: Number, required: true }, // 1, 2, 3 …
    userDebit: { type: Number, required: true },
    hostEarned: { type: Number, required: true },
    tickAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

module.exports = mongoose.model("BillingTick", billingTickSchema);
