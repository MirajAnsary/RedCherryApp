// host-backend/controllers/adminController.js
const Host = require("../models/Host");
const Withdrawal = require("../models/Withdrawal");

// ── GET /api/host/admin/stats ─────────────────────────────────────────────────
async function getStats(req, res) {
  try {
    const [
      totalHosts,
      onlineHosts,
      pendingKYC,
      pendingWithdrawals,
      earningsAgg,
      totalCallsAgg,
    ] = await Promise.all([
      Host.countDocuments(),
      Host.countDocuments({ isOnline: true }),
      Host.countDocuments({ "kyc.status": "submitted" }),
      Withdrawal.countDocuments({ status: "pending" }),
      Host.aggregate([{ $group: { _id: null, total: { $sum: "$earnings" } } }]),
      Host.aggregate([
        { $group: { _id: null, total: { $sum: "$totalCalls" } } },
      ]),
    ]);

    return res.json({
      success: true,
      stats: {
        totalHosts,
        onlineHosts,
        pendingKYC,
        pendingWithdrawals,
        totalEarnings: earningsAgg[0]?.total || 0,
        totalCalls: totalCallsAgg[0]?.total || 0,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── GET /api/host/admin/hosts ─────────────────────────────────────────────────
async function getAllHosts(req, res) {
  try {
    const hosts = await Host.find()
      .select(
        "firstName lastName phoneNumber email profileImage images introVideo auditionVideo kyc bank earnings isOnline isVerified accountStatus totalCalls totalMinutes createdAt updatedAt",
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, hosts });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── GET /api/host/admin/hosts/:hostId ─────────────────────────────────────────
async function getHostById(req, res) {
  try {
    const host = await Host.findById(req.params.hostId)
      .select("-password -refreshToken -refreshTokenBlacklist")
      .lean();

    if (!host) {
      return res
        .status(404)
        .json({ success: false, message: "Host not found." });
    }

    // Get withdrawal stats for this host
    const withdrawals = await Withdrawal.find({ hostId: host._id }).lean();
    const totalWithdrawn = withdrawals
      .filter((w) => w.status === "success")
      .reduce((s, w) => s + w.amount, 0);

    return res.json({
      success: true,
      host: {
        ...host,
        totalWithdrawn,
        withdrawalCount: withdrawals.length,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── PATCH /api/host/admin/hosts/:hostId/kyc ──────────────────────────────────
// body: { action: "approve" | "reject" }
async function updateKYCStatus(req, res) {
  try {
    const { action } = req.body;
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'action must be "approve" or "reject".',
      });
    }

    const host = await Host.findById(req.params.hostId);
    if (!host) {
      return res
        .status(404)
        .json({ success: false, message: "Host not found." });
    }

    host.kyc.status = action === "approve" ? "verified" : "rejected";

    // If KYC approved, also mark host as verified
    if (action === "approve") {
      host.isVerified = true;
      host.accountStatus = "approved";
    } else {
      host.accountStatus = "rejected";
    }

    await host.save();

    return res.json({
      success: true,
      message:
        action === "approve"
          ? "KYC approved. Host is now verified."
          : "KYC rejected.",
      kycStatus: host.kyc.status,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── PATCH /api/host/admin/hosts/:hostId/ban ──────────────────────────────────
// body: { banned: true | false }
async function toggleBan(req, res) {
  try {
    const host = await Host.findById(req.params.hostId);
    if (!host) {
      return res
        .status(404)
        .json({ success: false, message: "Host not found." });
    }

    host.isBanned = req.body.banned ?? true;
    await host.save();

    return res.json({
      success: true,
      message: host.isBanned ? "Host banned." : "Host unbanned.",
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── GET /api/host/admin/withdrawals ──────────────────────────────────────────
async function getAllWithdrawals(req, res) {
  try {
    const withdrawals = await Withdrawal.find().sort({ createdAt: -1 }).lean();

    // Populate host info manually (bank details, name, phone)
    const hostIds = [...new Set(withdrawals.map((w) => w.hostId.toString()))];
    const hosts = await Host.find({ _id: { $in: hostIds } })
      .select("firstName lastName phoneNumber bank earnings")
      .lean();

    const hostMap = {};
    hosts.forEach((h) => {
      hostMap[h._id.toString()] = h;
    });

    const enriched = withdrawals.map((w) => {
      const host = hostMap[w.hostId.toString()] || {};
      return {
        ...w,
        hostName: `${host.firstName || ""} ${host.lastName || ""}`.trim(),
        hostPhone: host.phoneNumber || "",
        bank: host.bank || {},
        currentWalletBalance: host.earnings || 0,
      };
    });

    return res.json({ success: true, withdrawals: enriched });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── PATCH /api/host/admin/withdrawals/:id/approve ────────────────────────────
async function approveWithdrawal(req, res) {
  try {
    const w = await Withdrawal.findById(req.params.id);
    if (!w) {
      return res
        .status(404)
        .json({ success: false, message: "Withdrawal not found." });
    }
    if (w.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending withdrawals can be approved.",
      });
    }

    w.status = "approved";
    w.approvedAt = new Date();
    await w.save();

    return res.json({ success: true, message: "Withdrawal approved." });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── PATCH /api/host/admin/withdrawals/:id/mark-paid ──────────────────────────
async function markWithdrawalPaid(req, res) {
  try {
    const w = await Withdrawal.findById(req.params.id);
    if (!w) {
      return res
        .status(404)
        .json({ success: false, message: "Withdrawal not found." });
    }

    w.status = "success";
    w.paidAt = new Date();
    await w.save();

    return res.json({ success: true, message: "Withdrawal marked as paid." });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── PATCH /api/host/admin/withdrawals/:id/reject ─────────────────────────────
async function rejectWithdrawal(req, res) {
  try {
    const w = await Withdrawal.findById(req.params.id);
    if (!w) {
      return res
        .status(404)
        .json({ success: false, message: "Withdrawal not found." });
    }
    if (w.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending withdrawals can be rejected.",
      });
    }

    // Refund the amount back to host earnings
    await Host.findByIdAndUpdate(w.hostId, { $inc: { earnings: w.amount } });

    w.status = "failed";
    w.rejectedAt = new Date();
    await w.save();

    return res.json({
      success: true,
      message: "Withdrawal rejected and amount refunded to host wallet.",
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── DELETE /api/host/admin/hosts/:hostId ─────────────────────────────────────
async function deleteHost(req, res) {
  try {
    const host = await Host.findById(req.params.hostId);
    if (!host) {
      return res
        .status(404)
        .json({ success: false, message: "Host not found." });
    }

    // Also delete all withdrawal records for this host
    await Withdrawal.deleteMany({ hostId: host._id });

    await Host.findByIdAndDelete(req.params.hostId);

    return res.json({
      success: true,
      message: `Host "${host.firstName} ${host.lastName}" deleted successfully.`,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

module.exports = {
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
};
