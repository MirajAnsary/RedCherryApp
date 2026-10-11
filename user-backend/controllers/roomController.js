// user-backend/controllers/roomController.js
// Reads live rooms from the SHARED MongoDB (same Atlas cluster, RedCherryHost db)
// This lets user-frontend display rooms created by hosts in real time.

const mongoose = require("mongoose");

// ── Lazy-load the Room model ──────────────────────────────────────────────────
// The Room collection lives in the "RedCherryHost" database (host-backend's db).
// We connect to it using a separate mongoose connection so we don't mix with
// the user database.

let _hostConn = null;
let _RoomModel = null;

function getRoomModel() {
  if (_RoomModel) return _RoomModel;

  // Re-use existing connection if already created
  if (!_hostConn) {
    _hostConn = mongoose.createConnection(
      process.env.HOST_DB_URI || process.env.MONGODB_URI,
      {
        dbName: "RedCherryHost",
      },
    );
  }

  const roomSchema = new mongoose.Schema(
    {
      roomName: String,
      channelName: String,
      hostId: mongoose.Schema.Types.ObjectId,
      hostName: String,
      hostAvatar: String,
      roomType: String,
      privacy: String,
      description: String,
      status: String,
      viewerCount: Number,
      currentUsers: Number,
      maxUsers: Number,
      viewers: Array,
    },
    { timestamps: true },
  );

  _RoomModel = _hostConn.model("Room", roomSchema, "rooms");
  return _RoomModel;
}

// ── GET /api/rooms/live ────────────────────────────────────────────────────────
// Returns all live public rooms (and private rooms without token leak)
exports.getLiveRooms = async (req, res) => {
  try {
    const Room = getRoomModel();
    const { type } = req.query; // optional filter: ?type=single|double|multiple

    const query = { status: "live" };
    if (type && ["single", "double", "multiple"].includes(type.toLowerCase())) {
      query.roomType = type.toLowerCase();
    }

    const rooms = await Room.find(query)
      .sort({ createdAt: -1 })
      .select(
        "roomName channelName hostName hostAvatar roomType privacy description viewerCount currentUsers maxUsers createdAt",
      )
      .limit(60)
      .lean();

    // Map to the shape that RoomCard.jsx already understands
    const mapped = rooms.map((r, i) => {
      const COLORS = ["#f9a8d4", "#c084fc", "#4ade80", "#ff85a1", "#fbbf24"];
      const initials = (r.hostName || "H").charAt(0).toUpperCase();
      return {
        // RoomCard-compatible fields
        id: r._id,
        channelName: r.channelName,
        type: r.roomType, // "single" | "double" | "multiple"
        name: r.hostName || "Host",
        hosts: [r.hostName || "Host"],
        hostLabel: r.roomType === "multiple" ? "Multiple Hosts" : r.hostName,
        roomName: r.roomName,
        age: null,
        viewerCount: r.viewerCount || 0,
        currentUsers: r.currentUsers || 0,
        maxUsers: r.maxUsers || 1,
        visibility: r.privacy, // "public" | "private"
        live: true,
        verified: false,
        initials,
        color: COLORS[i % COLORS.length],
        avatar: r.hostAvatar || null, // already stored as /host-uploads/avatars/xxx.jpg
        description: r.description || "",
      };
    });

    res.json({ success: true, rooms: mapped, total: mapped.length });
  } catch (err) {
    console.error("getLiveRooms error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch rooms." });
  }
};

// ── GET /api/rooms/token/:channelName ─────────────────────────────────────────
// Proxy token request to host-backend (port 5001) so user-frontend only calls
// one backend (port 5000).
exports.getRoomToken = async (req, res) => {
  try {
    const { channelName } = req.params;
    const uid = req.query.uid || "0";

    const hostApiBase = process.env.HOST_API_URL || "http://localhost:5001";
    const response = await fetch(
      `${hostApiBase}/api/host/rooms/token/${channelName}?uid=${uid}`,
    );
    const data = await response.json();

    if (!response.ok || !data.success) {
      return res.status(response.status || 400).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error("getRoomToken proxy error:", err);
    res
      .status(500)
      .json({ success: false, message: "Could not get room token." });
  }
};
