// host-backend/controllers/roomController.js
const { RtcTokenBuilder, RtcRole } = require("agora-token");
// Built-in UUID — the "uuid" package v13 is ESM-only and can't be require()'d
const { randomUUID: uuidv4 } = require("crypto");
const Room = require("../models/Room");

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERT = process.env.AGORA_APP_CERTIFICATE;

// ── Availability matrix (mirrors frontend AVAILABLE object) ──────────────────
// Public  → Single ✅  Double ✅  Multiple ✅
// Private → Single ✅  Double 🔜  Multiple 🔜
const AVAILABLE = {
  public: { single: true, double: true, multiple: true },
  private: { single: true, double: false, multiple: false },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function buildAgoraToken(channelName, uid, role) {
  const expiry = Math.floor(Date.now() / 1000) + 3600;
  return RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERT,
    channelName,
    uid,
    role,
    expiry,
    expiry,
  );
}

// ── POST /api/host/rooms/create ──────────────────────────────────────────────
exports.createRoom = async (req, res) => {
  try {
    const { roomName, roomType, privacy, description } = req.body;
    if (!roomName || !roomType || !privacy)
      return res.status(400).json({
        success: false,
        message: "roomName, roomType, and privacy are required.",
      });

    const rt = roomType.toLowerCase();
    const pv = privacy.toLowerCase();

    // ── Availability guard ────────────────────────────────────────────────────
    const privacyMap = AVAILABLE[pv];
    if (!privacyMap) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid privacy value." });
    }
    if (!privacyMap[rt]) {
      return res.status(400).json({
        success: false,
        message: `${privacy} ${roomType} rooms are coming soon and cannot be created yet.`,
      });
    }
    // ─────────────────────────────────────────────────────────────────────────

    const host = req.hostUser;
    const channelName = `rc_${uuidv4().replace(/-/g, "").slice(0, 16)}`;

    // End any previous live room by this host
    await Room.updateMany(
      { hostId: host._id, status: "live" },
      { status: "ended", endedAt: new Date() },
    );

    const room = await Room.create({
      roomName,
      channelName,
      hostId: host._id,
      hostName:
        `${host.firstName || ""} ${host.lastName || ""}`.trim() || "Host",
      // hostAvatar: host.profilePicture || null,
      hostAvatar: host.profileImage || null,
      roomType: rt,
      privacy: pv,
      description: description || "",
    });

    // ── Notify all connected users about new public room ──────────────────────
    if (pv === "public") {
      const io = req.app.get("io");
      if (io) {
        io.to("user-notifications").emit("new-room", {
          channelName: room.channelName,
          roomName: room.roomName,
          hostName: room.hostName,
          hostAvatar: room.hostAvatar,
          roomType: room.roomType,
          privacy: room.privacy,
        });
        console.log(
          `[Notification] new-room emitted | room=${room.channelName} | host=${room.hostName}`,
        );
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    const token = buildAgoraToken(
      channelName,
      String(host._id),
      RtcRole.PUBLISHER,
    );

    res.json({
      success: true,
      room: {
        id: room._id,
        channelName: room.channelName,
        roomName: room.roomName,
        roomType: room.roomType,
        privacy: room.privacy,
        maxUsers: room.maxUsers,
      },
      token,
      appId: APP_ID,
      uid: String(host._id),
    });
  } catch (err) {
    console.error("createRoom error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error creating room." });
  }
};

// ── GET /api/host/rooms/token/:channelName ───────────────────────────────────
exports.getViewerToken = async (req, res) => {
  try {
    const { channelName } = req.params;
    const uid = req.query.uid || "0";
    const room = await Room.findOne({ channelName, status: "live" });
    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Room not found or ended." });

    if (room.privacy === "private" && room.currentUsers >= room.maxUsers)
      return res.status(403).json({ success: false, message: "Room is full." });

    const token = buildAgoraToken(channelName, uid, RtcRole.SUBSCRIBER);

    res.json({
      success: true,
      token,
      appId: APP_ID,
      uid,
      room: {
        id: room._id,
        roomName: room.roomName,
        roomType: room.roomType,
        privacy: room.privacy,
        hostId: room.hostId,
        currentUsers: room.currentUsers,
        maxUsers: room.maxUsers,
      },
    });
  } catch (err) {
    console.error("getViewerToken error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── POST /api/host/rooms/end/:channelName ────────────────────────────────────
exports.endRoom = async (req, res) => {
  try {
    const { channelName } = req.params;
    const host = req.hostUser;
    const room = await Room.findOne({ channelName, hostId: host._id });
    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Room not found." });

    room.status = "ended";
    room.endedAt = new Date();
    await room.save();

    res.json({ success: true, message: "Room ended." });
  } catch (err) {
    console.error("endRoom error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ── GET /api/host/rooms/live ─────────────────────────────────────────────────
exports.getLiveRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: "live" })
      .sort({ createdAt: -1 })
      .select("-viewers")
      .limit(50);
    res.json({ success: true, rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};
