// user-backend/routes/grievance.js
const path = require("path");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const ctrl = require("../controllers/grievanceController");

// ✅ Use absolute path for multer tmp dir — relative paths break with pm2
const TMP_DIR = path.join(__dirname, "..", "uploads", "tmp");

const upload = multer({
  dest: TMP_DIR,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "video/mp4",
    ];
    const extOk = [".jpg", ".jpeg", ".png", ".gif", ".pdf", ".mp4"].some((e) =>
      file.originalname.toLowerCase().endsWith(e),
    );

    if (allowed.includes(file.mimetype) || extOk) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, GIF, PDF, MP4 files are allowed."), false);
    }
  },
});

// POST /api/grievance/submit  — public, no auth required
router.post("/submit", upload.single("evidence"), ctrl.submitGrievance);

module.exports = router;
