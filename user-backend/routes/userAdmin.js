// // user-backend/routes/userAdmin.js
// // Mount in server.js: app.use("/api/admin/users", require("./routes/userAdmin"));

// const express = require("express");
// const router = express.Router();
// const adminAuth = require("../middleware/userAdminAuth");
// const ctrl = require("../controllers/userAdminController");

// // All routes require: x-admin-key: <ADMIN_PASSWORD>
// router.use(adminAuth);

// // Stats
// router.get("/stats", ctrl.getStats);

// // Transactions (must be BEFORE /:userId to avoid route collision)
// router.get("/transactions", ctrl.getAllTransactions);

// // Grievances
// router.get("/grievances", ctrl.getAllGrievances);
// router.patch("/grievances/:id", ctrl.updateGrievance);

// // User management
// router.get("/", ctrl.getAllUsers);
// router.get("/:userId", ctrl.getUserById);
// router.patch("/:userId/ban", ctrl.toggleBan);
// router.patch("/:userId/balance", ctrl.adjustBalance);

// module.exports = router;

//For -admin manaual
// user-backend/routes/userAdmin.js
// Mount in server.js: app.use("/api/admin/users", require("./routes/userAdmin"));

const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/userAdminAuth");
const ctrl = require("../controllers/userAdminController");
const {
  adminGetAll,
  adminApprove,
  adminReject,
} = require("../controllers/manualRechargeController");

// ── LOGIN (public) — checks ADMIN_USERNAME / ADMIN_PASSWORD from .env ─────────
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts. Try again in 15 minutes.",
  },
});

router.post("/login", loginLimiter, (req, res) => {
  const { username, password } = req.body || {};
  if (
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_PASSWORD ||
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res
      .status(401)
      .json({ success: false, message: "Incorrect username or password." });
  }
  const token = jwt.sign({ role: "user-admin" }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
  res.json({ success: true, token });
});

// All other routes require: x-admin-key: <token from /login>
router.use(adminAuth);

// ── Stats ─────────────────────────────────────────────────────────────────────
router.get("/stats", ctrl.getStats);

// ── Transactions (BEFORE /:userId to avoid route conflict) ───────────────────
router.get("/transactions", ctrl.getAllTransactions);

// ── Grievances ────────────────────────────────────────────────────────────────
router.get("/grievances", ctrl.getAllGrievances);
router.patch("/grievances/:id", ctrl.updateGrievance);

// ── Manual Recharges (BEFORE /:userId to avoid route conflict) ────────────────
router.get("/manual-recharges", adminGetAll);
router.patch("/manual-recharges/:id/approve", adminApprove);
router.patch("/manual-recharges/:id/reject", adminReject);

// ── User management ───────────────────────────────────────────────────────────
router.get("/", ctrl.getAllUsers);
router.get("/:userId", ctrl.getUserById);
router.patch("/:userId/ban", ctrl.toggleBan);
router.patch("/:userId/balance", ctrl.adjustBalance);

module.exports = router;
