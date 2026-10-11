// user-backend/controllers/grievanceController.js
const path = require("path");
const fs = require("fs");
const Grievance = require("../models/Grievance");

const VALID_CATEGORIES = [
  "Objection to Content",
  "Nudity / Pornography",
  "Judicial Order",
  "Privacy",
  "Impersonation",
];

// POST /api/grievance/submit
exports.submitGrievance = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      appUserId,
      categories,
      description,
      affirmed,
    } = req.body;

    // ── Log incoming body for debugging ──────────────────────────────────
    console.log("Grievance submit body:", {
      firstName,
      phone,
      email,
      appUserId,
      categories,
      description,
      affirmed,
      hasFile: !!req.file,
    });

    // ── Validation ────────────────────────────────────────────────────────
    if (!firstName?.trim())
      return res
        .status(400)
        .json({ success: false, message: "First name is required." });
    if (!phone?.trim())
      return res
        .status(400)
        .json({ success: false, message: "Phone number is required." });
    if (!description?.trim())
      return res
        .status(400)
        .json({ success: false, message: "Description is required." });
    if (affirmed !== "true" && affirmed !== true)
      return res.status(400).json({
        success: false,
        message: "You must affirm the information is authentic.",
      });

    // ── Parse categories ──────────────────────────────────────────────────
    let cats = [];
    if (typeof categories === "string") {
      try {
        cats = JSON.parse(categories);
      } catch {
        cats = [categories];
      }
    } else if (Array.isArray(categories)) {
      cats = categories;
    }

    if (!Array.isArray(cats) || cats.length === 0)
      return res.status(400).json({
        success: false,
        message: "Select at least one complaint category.",
      });

    const invalidCat = cats.find((c) => !VALID_CATEGORIES.includes(c));
    if (invalidCat)
      return res
        .status(400)
        .json({ success: false, message: `Invalid category: ${invalidCat}` });

    // ── Handle uploaded evidence file ─────────────────────────────────────
    let evidenceFile = null;
    let evidenceOriginalName = null;

    if (req.file) {
      // Use __dirname-based absolute path — safe regardless of pm2 cwd
      const destDir = path.join(__dirname, "..", "uploads", "grievances");

      // Ensure directory exists
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const ext = path.extname(req.file.originalname).toLowerCase() || ".bin";
      const filename = `grievance-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
      const destPath = path.join(destDir, filename);

      // ✅ Use copyFileSync + unlinkSync instead of renameSync
      // renameSync fails when src and dest are on different filesystems/partitions
      fs.copyFileSync(req.file.path, destPath);
      fs.unlinkSync(req.file.path); // clean up tmp file

      evidenceFile = `/uploads/grievances/${filename}`;
      evidenceOriginalName = req.file.originalname;
    }

    // ── Save to MongoDB ───────────────────────────────────────────────────
    const grievance = await Grievance.create({
      firstName: firstName.trim(),
      lastName: (lastName || "").trim(),
      phone: phone.trim(),
      email: (email || "").trim(),
      appUserId: (appUserId || "").trim(),
      userId: req.user?._id || null,
      categories: cats,
      description: description.trim(),
      evidenceFile,
      evidenceOriginalName,
      affirmed: true,
    });

    console.log("Grievance saved:", grievance._id);

    return res.status(201).json({
      success: true,
      message:
        "Your grievance has been submitted. Our team will review it within 24–48 hours.",
      grievanceId: grievance._id,
    });
  } catch (err) {
    // ✅ Log the FULL error so you can see exactly what broke
    console.error("submitGrievance ERROR:", err.name, err.message);
    if (err.errors) {
      // Mongoose validation error — log each field
      Object.keys(err.errors).forEach((k) =>
        console.error("  Validation:", k, "→", err.errors[k].message),
      );
    }
    return res.status(500).json({
      success: false,
      message: err.message || "Server error. Please try again.",
    });
  }
};
