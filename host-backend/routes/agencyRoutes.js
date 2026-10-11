// host-backend/routes/agency.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Agency = require("../models/Agency");
const Host = require("../models/Host");
const verifyAgencyToken = require("../middleware/verifyAgencyToken");

// ── POST /api/host/agency/login ───────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Agency name and password required.",
        });
    }

    const agency = await Agency.findOne({ name: name.trim() });
    if (!agency || !agency.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const match = await agency.comparePassword(password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { agencyId: agency._id, name: agency.name, role: "agency" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.json({ success: true, token, agencyName: agency.name });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// ── GET /api/host/agency/hosts ────────────────────────────────────────────────
router.get("/hosts", verifyAgencyToken, async (req, res) => {
  try {
    const hosts = await Host.find()
      .select(
        "firstName lastName profileImage kyc isVerified earnings totalCalls totalMinutes createdAt",
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, hosts });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
