// //host-backend
// // models/Withdrawal.js
// const mongoose = require("mongoose");

// const withdrawalSchema = new mongoose.Schema(
//   {
//     hostId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Host",
//       required: true,
//     },
//     amount: { type: Number, required: true },
//     status: {
//       type: String,
//       enum: ["pending", "success", "failed"],
//       default: "pending",
//     },
//   },
//   { timestamps: true, collection: "WithdrawalHistory" },
// );

// module.exports = mongoose.model("Withdrawal", withdrawalSchema);

//v2
// host-backend/models/Withdrawal.js  (UPDATED)
const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
  {
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Host",
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      // pending → approved → success (paid) | failed (rejected)
      enum: ["pending", "approved", "success", "failed"],
      default: "pending",
    },
    approvedAt: { type: Date, default: null },
    paidAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: "WithdrawalHistory" },
);

module.exports = mongoose.model("Withdrawal", withdrawalSchema);
