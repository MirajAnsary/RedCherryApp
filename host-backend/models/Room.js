// host-backend/models/Room.js
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomName: { type: String, required: true, trim: true },
    channelName: { type: String, required: true, unique: true },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Host",
      required: true,
    },
    hostName: { type: String },
    hostAvatar: { type: String, default: null },
    roomType: {
      type: String,
      enum: ["single", "double", "multiple"],
      required: true,
    },
    privacy: { type: String, enum: ["public", "private"], required: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["live", "ended"], default: "live" },
    viewers: [{ userId: String, userName: String, joinedAt: Date }],
    viewerCount: { type: Number, default: 0 },
    currentUsers: { type: Number, default: 0 },
    maxUsers: { type: Number, default: 1 },
    endedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// compute maxUsers based on privacy + roomType before save
//
//            │  Single      │  Double      │  Multiple
// ───────────┼──────────────┼──────────────┼──────────────
//  Public    │  9999 (∞)    │  9999 (∞)    │  9999 (∞)
//  Private   │  2 (max)     │  🔜 Locked   │  🔜 Locked
//
roomSchema.pre("save", function (next) {
  if (this.privacy === "private" && this.roomType === "single") {
    this.maxUsers = 2; // Private single → max 2 users
  } else {
    this.maxUsers = 9999; // Everything else → unlimited
  }
  next();
});

module.exports = mongoose.model("Room", roomSchema);
