// user-backend/models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true },
    planId: { type: String },
    planLabel: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String, unique: true, sparse: true },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "success",
    },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
