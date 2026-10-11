//=========v2
// host-backend/server.js
require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const roomRoutes = require("./routes/room");

const Host = require("./models/Host");
const Room = require("./models/Room");
const BillingSession = require("./models/BillingSession");
const BillingTick = require("./models/BillingTick");
const adminRoutes = require("./routes/admin");
//routes
const agencyRoutes = require("./routes/agencyRoutes");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://redcheery.com",
  "https://www.redcheery.com",
];

// ── CORS ───────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── Socket.IO ──────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGINS, methods: ["GET", "POST"] },
});

// ── In-memory stores ──────────────────────────────────────────────────────
// { channelName: Set<socketId> }
const roomSockets = {};

// { socketId: { timeoutHandle, intervalHandle, sessionId, minuteCount,
//               userId, hostId, channelName, roomType, privacy, userRate, hostRate } }
const activeBilling = {};

// ── Billing rates ─────────────────────────────────────────────────────────
// Keyed by `${privacy}_${roomType}`
const BILLING_RATES = {
  public_single: { user: 48, host: 20 },
  public_double: { user: 100, host: 30 },
  public_multiple: { user: 234, host: 40 },
  private_single: { user: 170, host: 90 },
  private_double: { user: 170, host: 90 },
  private_multiple: { user: 170, host: 90 },
};

// Helper: look up rate by privacy + roomType
function getRate(privacy, roomType) {
  const key = `${(privacy || "public").toLowerCase()}_${(roomType || "single").toLowerCase()}`;
  return BILLING_RATES[key] || null;
}

// ─────────────────────────────────────────────────────────────────────────
// Open a second mongoose connection to user-backend DB (RedCherry)
// so we can atomically deduct user.talktimeBalance
// ─────────────────────────────────────────────────────────────────────────
let userDb = null;
let UserModel = null;
let TransactionModel = null;

function getUserModel() {
  if (UserModel) return UserModel;

  const userDbUri = process.env.USER_DB_URI || process.env.MONGODB_URI;

  // CRITICAL FIX: Do NOT pass { dbName } option — the database name "redcherry"
  // is already embedded in USER_DB_URI (...mongodb.net/redcherry?...). Passing
  // { dbName: "RedCherry" } here overrides it and connects to the wrong database,
  // causing User.findById to always return null → false insufficient-balance.
  userDb = mongoose.createConnection(userDbUri);

  userDb.on("connected", () =>
    console.log("[UserDB] ✅ Connected — database:", userDb.db?.databaseName),
  );
  userDb.on("error", (err) =>
    console.error("[UserDB] ❌ Connection error:", err.message),
  );

  const userSchema = new mongoose.Schema(
    {
      firstName: String,
      lastName: String,
      phoneNumber: String,
      talktimeBalance: { type: Number, default: 0 },
      isActive: { type: Boolean, default: true },
    },
    { strict: false },
  );

  UserModel = userDb.model("User", userSchema, "users");

  // Transaction schema — mirrors user-backend/models/Transaction.js
  const transactionSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
      },
      type: { type: String, enum: ["credit", "debit"], required: true },
      amount: { type: Number, required: true },
      planId: { type: String },
      planLabel: { type: String },
      status: { type: String, default: "success" },
      description: { type: String, default: "" },
    },
    { timestamps: true },
  );
  TransactionModel = userDb.model(
    "Transaction",
    transactionSchema,
    "transactions",
  );

  return UserModel;
}

// ─────────────────────────────────────────────────────────────────────────
// billingTick — deduct from user, credit host, log tick, update session
// Returns { kicked: true } if user balance is insufficient
// ─────────────────────────────────────────────────────────────────────────
async function billingTick(socketId, socket) {
  const session = activeBilling[socketId];
  if (!session) return;

  const {
    userId,
    hostId,
    channelName,
    roomType,
    privacy,
    userRate,
    hostRate,
    sessionId,
  } = session;
  const User = getUserModel();

  try {
    // Atomically deduct ONLY if balance >= rate  (findOneAndUpdate with condition)
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        talktimeBalance: { $gte: userRate }, // guard — only deduct if enough balance
      },
      { $inc: { talktimeBalance: -userRate } },
      { new: true },
    );

    if (!updatedUser) {
      // Balance insufficient — kick user
      console.log(`[Billing] KICK userId=${userId} — insufficient balance`);
      socket.emit("billing-kicked", {
        reason: "Your talktime balance has run out.",
        totalMinutes: session.minuteCount,
        totalDebit: session.minuteCount * userRate,
      });
      await endBillingSession(socketId, "kicked");
      return;
    }

    // Credit host earnings
    await Host.findByIdAndUpdate(hostId, { $inc: { earnings: hostRate } });

    // Increment minute count
    session.minuteCount += 1;

    // Log this tick
    await BillingTick.create({
      sessionId,
      userId,
      hostId,
      channelName,
      minuteNumber: session.minuteCount,
      userDebit: userRate,
      hostEarned: hostRate,
      tickAt: new Date(),
    });

    // Update session totals
    await BillingSession.findByIdAndUpdate(sessionId, {
      $inc: {
        totalMinutes: 1,
        totalUserDebit: userRate,
        totalHostEarned: hostRate,
      },
    });

    // Notify user of updated balance
    socket.emit("balance-updated", {
      newBalance: updatedUser.talktimeBalance,
      minuteNumber: session.minuteCount,
      debitedNow: userRate,
    });

    // Write a debit Transaction so it appears in Talktime Transactions history
    if (TransactionModel) {
      try {
        const ROOM_LABELS = {
          public_single: "Public Single Room",
          public_double: "Public Double Room",
          public_multiple: "Public Multiple Room",
          private_single: "Private Single Room",
          private_double: "Private Double Room",
          private_multiple: "Private Multiple Room",
        };
        const labelKey = `${privacy || "public"}_${roomType}`;
        await TransactionModel.create({
          userId,
          type: "debit",
          amount: userRate,
          planId: labelKey,
          planLabel: ROOM_LABELS[labelKey] || roomType,
          status: "success",
          description: `Live room — minute #${session.minuteCount} (${channelName})`,
        });
      } catch (txErr) {
        console.error("[Billing] Transaction write error:", txErr.message);
      }
    }

    console.log(
      `[Billing] Tick #${session.minuteCount} | user=${userId} | -₹${userRate} | host=${hostId} | +₹${hostRate} | balance=₹${updatedUser.talktimeBalance}`,
    );
  } catch (err) {
    console.error("[Billing] billingTick error:", err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// endBillingSession — clear timers, mark session ended/kicked in DB
// ─────────────────────────────────────────────────────────────────────────
async function endBillingSession(socketId, status = "ended") {
  const session = activeBilling[socketId];
  if (!session) return;

  clearTimeout(session.timeoutHandle);
  clearInterval(session.intervalHandle);
  delete activeBilling[socketId];

  try {
    await BillingSession.findByIdAndUpdate(session.sessionId, {
      status,
      endedAt: new Date(),
    });
    console.log(
      `[Billing] Session ended | status=${status} | user=${session.userId}`,
    );
  } catch (err) {
    console.error("[Billing] endBillingSession error:", err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Socket.IO connections
// ─────────────────────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  // ── join-notifications (user frontend subscribes for room alerts) ─────
  socket.on("join-notifications", () => {
    socket.join("user-notifications");
  });
  // ── join-room (user) ─────────────────────────────────────────────────
  // Client must send: { channelName, userId, userName, hostId, roomType, privacy }
  socket.on(
    "join-room",
    async ({ channelName, userId, userName, hostId, roomType, privacy }) => {
      // Viewers send hostId + roomType; the host's own socket doesn't.
      const wantsBilling = Boolean(userId && hostId && roomType);

      // A socket can only be billed for one session at a time — stop any
      // previous one so a repeated join-room never double-charges.
      if (activeBilling[socket.id]) {
        await endBillingSession(socket.id, "ended");
      }

      // Room settings come from the DB, not from the client, so a viewer
      // can't pick a cheaper rate or credit a different host.
      let roomDoc = null;
      try {
        roomDoc = await Room.findOne({ channelName, status: "live" }).lean();
      } catch (err) {
        console.error("[Room] lookup failed:", err.message);
      }
      if (roomDoc) {
        hostId = String(roomDoc.hostId);
        roomType = roomDoc.roomType;
        privacy = roomDoc.privacy;
      }
      const resolvedPrivacy = (privacy || "public").toLowerCase();

      // Billable viewer: identity must come from their login token, not from
      // the userId in the payload (otherwise anyone could bill anyone).
      if (wantsBilling) {
        try {
          const decoded = jwt.verify(
            socket.handshake.auth?.token,
            process.env.JWT_SECRET,
          );
          if (!decoded?.id) throw new Error("no user id in token");
          userId = String(decoded.id);
        } catch (err) {
          socket.emit("join-error", {
            message: "Please sign in again to join this room.",
          });
          return;
        }
      }

      // ── Private room capacity guard ───────────────────────────────────────
      // Public rooms: unlimited (maxUsers = 9999), never blocked here.
      // Private single: maxUsers = 2 → block when full.
      // Private double/multiple: 🔜 locked (maxUsers still enforced when released).
      if (
        resolvedPrivacy === "private" &&
        roomDoc &&
        roomDoc.currentUsers >= roomDoc.maxUsers
      ) {
        socket.emit("room-full", {
          message: `This private room is full (${roomDoc.maxUsers} user${roomDoc.maxUsers > 1 ? "s" : ""} max). Please wait for a user to leave.`,
        });
        return; // reject — do NOT join
      }

      // Re-joining the same channel must not count the user twice
      const alreadyJoined = socket._joinedChannel === channelName;
      socket.join(channelName);
      if (!roomSockets[channelName]) roomSockets[channelName] = new Set();
      roomSockets[channelName].add(socket.id);

      // ── Increment currentUsers in DB ──────────────────────────────────────
      if (!alreadyJoined) {
        try {
          await Room.findOneAndUpdate(
            { channelName, status: "live" },
            { $inc: { currentUsers: 1 } },
          );
        } catch (err) {
          console.error("[Room] increment currentUsers failed:", err.message);
        }
      }
      socket._joinedChannel = channelName; // remember for decrement on disconnect

      const count = roomSockets[channelName].size;
      io.to(channelName).emit("viewer-count", count);
      socket.to(channelName).emit("user-joined", { userId, userName });

      // ── Billing: only start if we have userId, hostId, roomType ──────────
      if (!wantsBilling) return;

      const rate = getRate(resolvedPrivacy, roomType);
      if (!rate) {
        console.warn(
          `[Billing] Unknown rate key: ${privacy}_${roomType} — skipping billing`,
        );
        return;
      }

      const User = getUserModel();

      // Check minimum balance before allowing join
      let currentUser;
      try {
        console.log(
          `[Billing] DB=${userDb?.db?.databaseName} | Looking up userId=${userId}`,
        );
        currentUser = await User.findById(userId).lean();
        console.log(
          `[Billing] Lookup: ${currentUser ? `✅ found balance=₹${currentUser.talktimeBalance}` : "❌ NOT FOUND — wrong DB or userId"}`,
        );
      } catch (err) {
        // DB error — log it but DO NOT block the user (server config bug must not
        // punish users who have valid balance)
        console.error("[Billing] ❌ DB error fetching user:", err.message);
        currentUser = null;
      }

      if (currentUser === null) {
        // Could not find user — allow join but log warning so you can fix the DB
        console.error(
          `[Billing] ⚠️  userId=${userId} not found. Allowing join. Check USER_DB_URI database name.`,
        );
        // Fall through — billing ticks will handle actual balance enforcement
      } else if (currentUser.talktimeBalance < rate.user) {
        // Confirmed real insufficient balance — block join
        console.log(
          `[Billing] ❌ Blocking join: balance=₹${currentUser.talktimeBalance} < required=₹${rate.user}`,
        );
        socket.emit("insufficient-balance", {
          required: rate.user,
          current: currentUser.talktimeBalance,
          message: `You need at least ₹${rate.user} to join this room. Please recharge.`,
        });
        return;
      }

      // Create billing session record
      let sessionDoc;
      try {
        sessionDoc = await BillingSession.create({
          userId,
          userName,
          hostId,
          channelName,
          roomType,
          privacy: resolvedPrivacy,
          userRatePerMin: rate.user,
          hostRatePerMin: rate.host,
          startedAt: new Date(),
          status: "active",
        });
      } catch (err) {
        console.error("[Billing] Cannot create BillingSession:", err.message);
        return;
      }

      console.log(
        `[Billing] Session started | user=${userId} | room=${channelName} | privacy=${resolvedPrivacy} | type=${roomType} | rate=₹${rate.user}/min`,
      );

      // Notify user that billing will start in 10 seconds
      socket.emit("billing-starting", {
        delaySeconds: 10,
        ratePerMin: rate.user,
        roomType,
        privacy: resolvedPrivacy,
      });

      // Store session metadata
      activeBilling[socket.id] = {
        userId,
        hostId,
        channelName,
        roomType,
        privacy: resolvedPrivacy,
        userRate: rate.user,
        hostRate: rate.host,
        sessionId: sessionDoc._id,
        minuteCount: 0,
        timeoutHandle: null,
        intervalHandle: null,
      };

      // 10-second delay then start per-minute billing
      const timeoutHandle = setTimeout(() => {
        if (!activeBilling[socket.id]) return; // user left before billing started

        // First tick immediately after 10 s
        billingTick(socket.id, socket);

        // Then every 60 seconds
        const intervalHandle = setInterval(() => {
          if (!activeBilling[socket.id]) {
            clearInterval(intervalHandle);
            return;
          }
          billingTick(socket.id, socket);
        }, 60_000);

        if (activeBilling[socket.id]) {
          activeBilling[socket.id].intervalHandle = intervalHandle;
        }
      }, 10_000);

      activeBilling[socket.id].timeoutHandle = timeoutHandle;
    },
  );

  // ── Chat message ─────────────────────────────────────────────────────
  socket.on("chat-message", ({ channelName, userId, userName, message }) => {
    io.to(channelName).emit("chat-message", {
      userId,
      userName,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  // ── Host ends room ───────────────────────────────────────────────────
  socket.on("end-room", async ({ channelName }) => {
    io.to(channelName).emit("room-ended");

    // End billing for ALL users in this room
    const socketsInRoom = io.sockets.adapter.rooms.get(channelName);
    if (socketsInRoom) {
      for (const sid of socketsInRoom) {
        if (activeBilling[sid]) {
          const s = io.sockets.sockets.get(sid);
          if (s) {
            s.emit("billing-summary", {
              totalMinutes: activeBilling[sid].minuteCount,
              totalDebit:
                activeBilling[sid].minuteCount * activeBilling[sid].userRate,
            });
          }
          await endBillingSession(sid, "ended");
        }
      }
    }

    delete roomSockets[channelName];
  });

  // ── User manually leaves ─────────────────────────────────────────────
  socket.on("leave-room", async ({ channelName }) => {
    if (activeBilling[socket.id]) {
      socket.emit("billing-summary", {
        totalMinutes: activeBilling[socket.id].minuteCount,
        totalDebit:
          activeBilling[socket.id].minuteCount *
          activeBilling[socket.id].userRate,
      });
      await endBillingSession(socket.id, "ended");
    }
    socket.leave(channelName);
    if (roomSockets[channelName]) {
      roomSockets[channelName].delete(socket.id);
      io.to(channelName).emit("viewer-count", roomSockets[channelName].size);
    }
    // ── Decrement currentUsers ────────────────────────────────────────────
    try {
      await Room.findOneAndUpdate(
        { channelName, status: "live", currentUsers: { $gt: 0 } },
        { $inc: { currentUsers: -1 } },
      );
    } catch (err) {
      console.error(
        "[Room] decrement currentUsers on leave failed:",
        err.message,
      );
    }
    socket._joinedChannel = null;
  });

  // ── Disconnect (tab close / network drop) ────────────────────────────
  socket.on("disconnecting", async () => {
    if (activeBilling[socket.id]) {
      await endBillingSession(socket.id, "ended");
    }
    socket.rooms.forEach((room) => {
      if (roomSockets[room]) {
        roomSockets[room].delete(socket.id);
        const count = roomSockets[room].size;
        io.to(room).emit("viewer-count", count);
      }
    });
    // ── Decrement currentUsers on unexpected disconnect ───────────────────
    const ch = socket._joinedChannel;
    if (ch) {
      try {
        await Room.findOneAndUpdate(
          { channelName: ch, status: "live", currentUsers: { $gt: 0 } },
          { $inc: { currentUsers: -1 } },
        );
      } catch (err) {
        console.error(
          "[Room] decrement currentUsers on disconnect failed:",
          err.message,
        );
      }
    }
  });
});

// Make io accessible in controllers
app.set("io", io);

// ── Body & cookie parsing ──────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Static uploads ─────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/host/auth", authRoutes);
app.use("/api/host/profile", profileRoutes);
app.use("/api/host/rooms", roomRoutes);
app.use("/api/host/admin", adminRoutes);
app.use("/api/host/agency", agencyRoutes);
app.get("/api/health", (_req, res) =>
  res.json({
    status: "ok",
    service: "Red Cherry Host API",
    timestamp: new Date().toISOString(),
  }),
);

// ── 404 & error handlers ───────────────────────────────────────────────────
app.use("*", (_req, res) =>
  res.status(404).json({ success: false, message: "Route not found." }),
);
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Internal server error." });
});

// ── Database & server start ────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI, { dbName: "RedCherryHost" })
  .then(() => {
    console.log("✅ MongoDB connected — RedCherryHost database");
    // Pre-warm user DB connection
    getUserModel();
    server.listen(PORT, () => {
      console.log(`🚀 Red Cherry Host API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

module.exports = app;
