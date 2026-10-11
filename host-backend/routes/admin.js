// // host-backend/routes/admin.js
// const express = require("express");
// const router = express.Router();
// const adminAuth = require("../middleware/adminAuth");
// const {
//   getStats,
//   getAllHosts,
//   getHostById,
//   updateKYCStatus,
//   toggleBan,
//   deleteHost,
//   getAllWithdrawals,
//   approveWithdrawal,
//   markWithdrawalPaid,
//   rejectWithdrawal,
// } = require("../controllers/adminController");

// // All routes require admin key header: x-admin-key: <removed>
// router.use(adminAuth);

// // Stats
// router.get("/stats", getStats);

// // Host management
// router.get("/hosts", getAllHosts);
// router.get("/hosts/:hostId", getHostById);
// router.patch("/hosts/:hostId/kyc", updateKYCStatus);
// router.patch("/hosts/:hostId/ban", toggleBan);
// router.delete("/hosts/:hostId", deleteHost);

// // Withdrawal management
// router.get("/withdrawals", getAllWithdrawals);
// router.patch("/withdrawals/:id/approve", approveWithdrawal);
// router.patch("/withdrawals/:id/mark-paid", markWithdrawalPaid);
// router.patch("/withdrawals/:id/reject", rejectWithdrawal);

// module.exports = router;

//=========admin+ agency
// host-backend/routes/admin.js
// FULL FILE — replaces your existing admin.js
const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const {
  getStats,
  getAllHosts,
  getHostById,
  updateKYCStatus,
  toggleBan,
  deleteHost,
  getAllWithdrawals,
  approveWithdrawal,
  markWithdrawalPaid,
  rejectWithdrawal,
} = require("../controllers/adminController");
const {
  createAgency,
  listAgencies,
  deleteAgency,
} = require("../controllers/agencyAdminController");

// ── LOGIN (public) — checks ADMIN_USERNAME / ADMIN_PASSWORD from .env ─────────
const jwt = require("jsonwebtoken");

// Max 10 failed attempts per IP per 15 minutes
const failedLogins = new Map(); // ip -> { count, resetAt }

router.post("/login", (req, res) => {
  const ip = req.ip;
  const now = Date.now();
  const entry = failedLogins.get(ip);
  if (entry && entry.resetAt > now && entry.count >= 10) {
    return res.status(429).json({
      success: false,
      message: "Too many login attempts. Try again in 15 minutes.",
    });
  }

  const { username, password } = req.body || {};
  if (
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_PASSWORD ||
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    const fresh = !entry || entry.resetAt <= now;
    failedLogins.set(ip, {
      count: fresh ? 1 : entry.count + 1,
      resetAt: fresh ? now + 15 * 60 * 1000 : entry.resetAt,
    });
    return res
      .status(401)
      .json({ success: false, message: "Incorrect username or password." });
  }

  failedLogins.delete(ip);
  const token = jwt.sign({ role: "host-admin" }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
  res.json({ success: true, token });
});

// All other routes require: x-admin-key: <token from /login>
router.use(adminAuth);

// ── Stats ──────────────────────────────────────────────────────────────────────
router.get("/stats", getStats);

// ── Host management ────────────────────────────────────────────────────────────
router.get("/hosts", getAllHosts);
router.get("/hosts/:hostId", getHostById);
router.patch("/hosts/:hostId/kyc", updateKYCStatus);
router.patch("/hosts/:hostId/ban", toggleBan);
router.delete("/hosts/:hostId", deleteHost);

// ── Withdrawal management ──────────────────────────────────────────────────────
router.get("/withdrawals", getAllWithdrawals);
router.patch("/withdrawals/:id/approve", approveWithdrawal);
router.patch("/withdrawals/:id/mark-paid", markWithdrawalPaid);
router.patch("/withdrawals/:id/reject", rejectWithdrawal);

// ── Agency management ──────────────────────────────────────────────────────────
router.post("/agencies", createAgency);
router.get("/agencies", listAgencies);
router.delete("/agencies/:id", deleteAgency);

module.exports = router;
