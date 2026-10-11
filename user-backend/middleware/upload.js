//host-backend
// middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "profiles");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // e.g. profile-<userId>-<timestamp>.jpg
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `profile-${_req.user._id}-${Date.now()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = [
    "image/jpeg", // .jpg / .jpeg
    "image/png", // .png
    "image/webp", // .webp
    "image/heic", // .heic (iPhone)
    "image/heif", // .heif (iPhone alternate)
  ];

  // Some browsers/devices report HEIC as "application/octet-stream" or
  // with no mimetype — fall back to checking the file extension.
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];

  if (allowed.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only HEIC, JPG, JPEG, PNG, and WebP images are allowed."),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
