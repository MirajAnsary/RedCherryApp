//===================v2-v3-v4
// user-backend/controllers/userAdminController.js
// Full user admin controller — stats, user management, balance, transactions, grievances

const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Grievance = require("../models/Grievance");

// ── helper: validate ObjectId — prevents CastError → 500 ─────────────────────
function isValidId(id) {
  return id && mongoose.Types.ObjectId.isValid(id);
}

// ── GET /api/admin/users/stats ────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      bannedUsers,
      pendingGrievances,
      revenueAgg,
      debitAgg,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      Grievance.countDocuments({ status: "pending" }),
      Transaction.aggregate([
        { $match: { type: "credit", status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        { $match: { type: "debit", status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    return res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        bannedUsers,
        pendingGrievances,
        totalRechargeRevenue: revenueAgg[0]?.total || 0,
        totalTalktimeDeducted: debitAgg[0]?.total || 0,
      },
    });
  } catch (e) {
    console.error("[getStats]", e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ── GET /api/admin/users?page=1&limit=20&search= ──────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const search = (req.query.search || "").trim();

    const filter = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select(
          "firstName lastName phoneNumber email gender age profilePicture talktimeBalance isActive isVerified lastLogin createdAt",
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return res.json({ success: true, users, total, page, limit });
  } catch (e) {
    console.error("[getAllUsers]", e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ── GET /api/admin/users/:userId ──────────────────────────────────────────────
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ FIX 1: Validate ObjectId before querying — prevents CastError → 500
    if (!isValidId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format." });
    }

    const user = await User.findById(userId)
      .select("-password -otp -refreshToken")
      .lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // ✅ FIX 2: Run queries independently so one failure doesn't crash everything
    let transactions = [];
    let grievances = [];

    try {
      transactions = await Transaction.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(30)
        .lean();
    } catch (txErr) {
      console.error("[getUserById] Transaction query failed:", txErr.message);
    }

    try {
      grievances = await Grievance.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .lean();
    } catch (grErr) {
      console.error("[getUserById] Grievance query failed:", grErr.message);
    }

    // Compute lifetime totals
    const totalRecharged = transactions
      .filter((t) => t.type === "credit" && t.status === "success")
      .reduce((s, t) => s + t.amount, 0);

    const totalSpent = transactions
      .filter((t) => t.type === "debit" && t.status === "success")
      .reduce((s, t) => s + t.amount, 0);

    return res.json({
      success: true,
      user,
      transactions,
      grievances,
      summary: { totalRecharged, totalSpent },
    });
  } catch (e) {
    console.error("[getUserById]", e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ── PATCH /api/admin/users/:userId/ban ────────────────────────────────────────
// body: { ban: true | false }
exports.toggleBan = async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ FIX: Validate ObjectId
    if (!isValidId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format." });
    }

    const { ban } = req.body;
    if (typeof ban !== "boolean") {
      return res
        .status(400)
        .json({ success: false, message: "ban must be true or false." });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: !ban },
      { new: true },
    ).select("firstName lastName phoneNumber isActive");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    return res.json({
      success: true,
      message: ban
        ? `User "${user.firstName} ${user.lastName}" has been banned.`
        : `User "${user.firstName} ${user.lastName}" has been unbanned.`,
      user,
    });
  } catch (e) {
    console.error("[toggleBan]", e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ── PATCH /api/admin/users/:userId/balance ────────────────────────────────────
// body: { type: "credit"|"debit", amount: Number, reason: String }
exports.adjustBalance = async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ FIX: Validate ObjectId
    if (!isValidId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format." });
    }

    const { type, amount, reason } = req.body;

    if (!["credit", "debit"].includes(type)) {
      return res
        .status(400)
        .json({ success: false, message: "type must be credit or debit." });
    }
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "amount must be a positive number." });
    }

    // For debit, ensure balance won't go negative
    const userBefore = await User.findById(userId).select(
      "talktimeBalance firstName lastName",
    );
    if (!userBefore) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (type === "debit" && userBefore.talktimeBalance < amt) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. User has ₹${userBefore.talktimeBalance}.`,
      });
    }

    const inc = type === "credit" ? amt : -amt;
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { talktimeBalance: inc } },
      { new: true },
    ).select("firstName lastName talktimeBalance");

    // Log transaction
    await Transaction.create({
      userId: user._id,
      type,
      amount: amt,
      planId: "admin_adjustment",
      planLabel: "Admin Adjustment",
      status: "success",
      description: reason || `Admin ${type} — ₹${amt}`,
    });

    return res.json({
      success: true,
      message: `₹${amt} ${type === "credit" ? "credited to" : "debited from"} ${user.firstName}'s wallet.`,
      newBalance: user.talktimeBalance,
    });
  } catch (e) {
    console.error("[adjustBalance]", e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ── GET /api/admin/users/transactions ─────────────────────────────────────────
// query: page, limit, userId, type, status
exports.getAllTransactions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 30);
    const skip = (page - 1) * limit;

    const filter = {};

    // ✅ FIX: Validate userId query param before casting to ObjectId
    if (req.query.userId) {
      if (!isValidId(req.query.userId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid userId filter." });
      }
      filter.userId = new mongoose.Types.ObjectId(req.query.userId);
    }

    if (req.query.type && ["credit", "debit"].includes(req.query.type)) {
      filter.type = req.query.type;
    }
    if (
      req.query.status &&
      ["success", "failed", "pending"].includes(req.query.status)
    ) {
      filter.status = req.query.status;
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(filter),
    ]);

    // Enrich with user name
    const userIds = [...new Set(transactions.map((t) => String(t.userId)))];
    const users = await User.find({ _id: { $in: userIds } })
      .select("firstName lastName phoneNumber")
      .lean();
    const userMap = Object.fromEntries(users.map((u) => [String(u._id), u]));

    const enriched = transactions.map((t) => ({
      ...t,
      user: userMap[String(t.userId)] || null,
    }));

    return res.json({
      success: true,
      transactions: enriched,
      total,
      page,
      limit,
    });
  } catch (e) {
    console.error("[getAllTransactions]", e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ── GET /api/admin/users/grievances ──────────────────────────────────────────
// query: status, page, limit
exports.getAllGrievances = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [grievances, total] = await Promise.all([
      Grievance.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Grievance.countDocuments(filter),
    ]);

    return res.json({ success: true, grievances, total, page, limit });
  } catch (e) {
    console.error("[getAllGrievances]", e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ── PATCH /api/admin/users/grievances/:id ─────────────────────────────────────
// body: { status, adminNote }
exports.updateGrievance = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ FIX: Validate ObjectId
    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid grievance ID format." });
    }

    const { status, adminNote } = req.body;
    const validStatuses = ["pending", "under_review", "resolved", "rejected"];
    if (status && !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status." });
    }

    const update = {};
    if (status) update.status = status;
    if (adminNote !== undefined) update.adminNote = adminNote;

    const grievance = await Grievance.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!grievance) {
      return res
        .status(404)
        .json({ success: false, message: "Grievance not found." });
    }

    return res.json({
      success: true,
      message: "Grievance updated.",
      grievance,
    });
  } catch (e) {
    console.error("[updateGrievance]", e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
};
