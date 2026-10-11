// user-backend/controllers/manualRechargeController.js

const mongoose = require("mongoose");
const ManualRecharge = require("../models/ManualRecharge");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

function isValidId(id) {
  return id && mongoose.Types.ObjectId.isValid(id);
}

// ── POST /api/recharge/manual/submit  (user — requires auth) ──────────────────
exports.submitRecharge = async (req, res) => {
  try {
    const { amount, utrNumber } = req.body;
    const userId = req.user._id;

    // Validate amount
    const amt = Number(amount);
    if (!amt || amt < 1 || !Number.isFinite(amt)) {
      return res
        .status(400)
        .json({ success: false, message: "Amount must be a positive number." });
    }

    // Validate UTR — exactly 12 digits
    const utr = String(utrNumber || "").trim();
    if (!/^\d{12}$/.test(utr)) {
      return res.status(400).json({
        success: false,
        message: "UTR must be exactly 12 digits (numbers only).",
      });
    }

    // Check duplicate UTR
    const existing = await ManualRecharge.findOne({ utrNumber: utr });
    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "This UTR has already been submitted. Contact support if this is an error.",
      });
    }

    const recharge = await ManualRecharge.create({
      userId,
      amount: amt,
      utrNumber: utr,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message:
        "Request submitted! Admin will verify within a few hours and credit your wallet.",
      recharge,
    });
  } catch (e) {
    console.error("[submitRecharge]", e.message);
    // Handle mongoose duplicate key (race condition)
    if (e.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This UTR has already been submitted.",
      });
    }
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ── GET /api/recharge/manual/my  (user — requires auth) ───────────────────────
exports.getMyRecharges = async (req, res) => {
  try {
    const recharges = await ManualRecharge.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, recharges });
  } catch (e) {
    console.error("[getMyRecharges]", e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ── GET /api/admin/users/manual-recharges  (admin) ───────────────────────────
// query: status, page, limit
exports.adminGetAll = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (
      req.query.status &&
      ["pending", "approved", "rejected"].includes(req.query.status)
    ) {
      filter.status = req.query.status;
    }

    // Sort: pending first, then newest
    const [recharges, total] = await Promise.all([
      ManualRecharge.aggregate([
        { $match: filter },
        {
          $addFields: {
            _pendingFirst: { $cond: [{ $eq: ["$status", "pending"] }, 0, 1] },
          },
        },
        { $sort: { _pendingFirst: 1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        { $project: { _pendingFirst: 0 } },
      ]),
      ManualRecharge.countDocuments(filter),
    ]);

    // Enrich with user info
    const userIds = [...new Set(recharges.map((r) => String(r.userId)))];
    const users = await User.find({ _id: { $in: userIds } })
      .select("firstName lastName phoneNumber")
      .lean();
    const userMap = Object.fromEntries(users.map((u) => [String(u._id), u]));

    const enriched = recharges.map((r) => ({
      ...r,
      user: userMap[String(r.userId)] || null,
    }));

    // Count pending separately for badge
    const pendingCount = await ManualRecharge.countDocuments({
      status: "pending",
    });

    return res.json({
      success: true,
      recharges: enriched,
      total,
      page,
      limit,
      pendingCount,
    });
  } catch (e) {
    console.error("[adminGetAll]", e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ── PATCH /api/admin/users/manual-recharges/:id/approve  (admin) ─────────────
exports.adminApprove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid recharge ID." });
    }

    // Atomically flip pending → approved so a double-click / two admins
    // can never credit the same request twice
    const recharge = await ManualRecharge.findOneAndUpdate(
      { _id: id, status: "pending" },
      { $set: { status: "approved", approvedAt: new Date() } },
      { new: true },
    );
    if (!recharge) {
      const existing = await ManualRecharge.findById(id).lean();
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Recharge request not found." });
      }
      return res.status(409).json({
        success: false,
        message: `Cannot approve — request is already ${existing.status}.`,
      });
    }

    // Credit user wallet
    const user = await User.findByIdAndUpdate(
      recharge.userId,
      { $inc: { talktimeBalance: recharge.amount } },
      { new: true },
    ).select("firstName lastName talktimeBalance");

    if (!user) {
      // Roll back the status so the request can be handled again
      await ManualRecharge.updateOne(
        { _id: recharge._id },
        { $set: { status: "pending", approvedAt: null } },
      );
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Log transaction
    await Transaction.create({
      userId: recharge.userId,
      type: "credit",
      amount: recharge.amount,
      planId: "manual_qr_recharge",
      planLabel: "Manual QR Recharge",
      status: "success",
      description: `QR Recharge — UTR: ${recharge.utrNumber}`,
    });

    return res.json({
      success: true,
      message: `₹${recharge.amount} credited to ${user.firstName}'s wallet.`,
      recharge,
      newBalance: user.talktimeBalance,
    });
  } catch (e) {
    console.error("[adminApprove]", e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// ── PATCH /api/admin/users/manual-recharges/:id/reject  (admin) ──────────────
exports.adminReject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid recharge ID." });
    }

    const recharge = await ManualRecharge.findById(id);
    if (!recharge) {
      return res
        .status(404)
        .json({ success: false, message: "Recharge request not found." });
    }
    if (recharge.status !== "pending") {
      return res.status(409).json({
        success: false,
        message: `Cannot reject — request is already ${recharge.status}.`,
      });
    }

    const { adminNote } = req.body;

    recharge.status = "rejected";
    recharge.rejectedAt = new Date();
    recharge.adminNote = adminNote?.trim() || "";
    await recharge.save();

    return res.json({
      success: true,
      message: "Recharge request rejected.",
      recharge,
    });
  } catch (e) {
    console.error("[adminReject]", e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
};
