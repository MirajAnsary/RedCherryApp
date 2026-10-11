// host-backend/controllers/agencyAdminController.js
// Add these to your existing adminController.js OR import separately

const Agency = require("../models/Agency");

// ── POST /api/host/admin/agencies ─────────────────────────────────────────────
async function createAgency(req, res) {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Name and password required." });
    }
    const exists = await Agency.findOne({ name: name.trim() });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Agency name already exists." });
    }
    const agency = await Agency.create({ name: name.trim(), password });
    return res.json({
      success: true,
      agency: {
        _id: agency._id,
        name: agency.name,
        isActive: agency.isActive,
        createdAt: agency.createdAt,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── GET /api/host/admin/agencies ──────────────────────────────────────────────
async function listAgencies(req, res) {
  try {
    const agencies = await Agency.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, agencies });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── DELETE /api/host/admin/agencies/:id ───────────────────────────────────────
async function deleteAgency(req, res) {
  try {
    await Agency.findByIdAndUpdate(req.params.id, { isActive: false });
    return res.json({ success: true, message: "Agency deactivated." });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

module.exports = { createAgency, listAgencies, deleteAgency };
