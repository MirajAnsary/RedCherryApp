//host-backend
//// routes/profile.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/verifyHostToken");
const ctrl = require("../controllers/profileController");

// ── Ensure upload directories exist ────────────────────────────────────────
const dirs = ["avatars", "images", "videos", "kyc", "tmp"].map((d) =>
  path.join(__dirname, "../uploads", d),
);
dirs.forEach((d) => fs.mkdirSync(d, { recursive: true }));

// ── Multer disk storage (keeps original extension, no hash filenames) ───────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Route each file type to correct subfolder
    let folder = "tmp";
    if (file.mimetype.startsWith("image/")) folder = "tmp"; // controller moves it
    if (file.mimetype.startsWith("video/")) folder = "tmp"; // controller moves it
    cb(null, path.join(__dirname, "../uploads", folder));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".bin";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ok = /image|video/.test(file.mimetype);
  cb(ok ? null : new Error("Only image/video files allowed."), ok);
};

// ── Single multer instance — 200MB limit for videos ────────────────────────
const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
  fileFilter,
});

// ── Routes ──────────────────────────────────────────────────────────────────
router.get("/hosts", auth, ctrl.getHosts);
router.put("/update-name", auth, ctrl.updateName);
router.post("/upload-avatar", auth, upload.single("avatar"), ctrl.uploadAvatar);
router.delete("/delete-avatar", auth, ctrl.deleteAvatar);
router.get("/images", auth, ctrl.getImages);
router.post("/images", auth, upload.single("image"), ctrl.addImage);
router.put("/images/:imageId", auth, upload.single("image"), ctrl.replaceImage);
router.delete("/images/:imageId", auth, ctrl.deleteImage);
router.get("/video", auth, ctrl.getVideo);
router.post("/video", auth, upload.single("video"), ctrl.uploadVideo);
router.delete("/video", auth, ctrl.deleteVideo);
router.get("/audition-video", auth, ctrl.getAuditionVideo);
router.post(
  "/audition-video",
  auth,
  upload.single("video"),
  ctrl.uploadAuditionVideo,
);
router.delete("/audition-video", auth, ctrl.deleteAuditionVideo);
router.get("/kyc", auth, ctrl.getKYC);
router.post("/kyc/upload", auth, upload.single("file"), ctrl.uploadKYCDoc);
router.delete("/kyc/:docType", auth, ctrl.deleteKYCDoc);
router.post("/kyc/submit", auth, ctrl.submitKYC);
router.get("/bank", auth, ctrl.getBankDetails);
router.post("/bank", auth, ctrl.saveBankDetails);
router.post("/withdraw", auth, ctrl.withdraw);
router.get("/withdrawal-history", auth, ctrl.withdrawalHistory);

// ── GET /api/host/profile/public-hosts — no auth required ──────────────────
// Used by user-frontend to show available hosts in OnCall / top picks grid
router.get("/public-hosts", async (req, res) => {
  try {
    const Host = require("../models/Host");
    //OLD
    // const hosts = await Host.find({ isVerified: true })
    //   .select("firstName lastName age gender profileImage images location")
    //   .lean();

    // const mapped = hosts.map((h) => ({
    //   id: h._id,
    //   name: `${h.firstName} ${h.lastName}`.trim(),
    //   firstName: h.firstName,
    //   age: h.age || null,
    //   gender: h.gender || null,
    //   profileImage: h.profileImage || null,
    //   images: (h.images || []).map((img) => img.url),
    //   location: h.location || null,
    //   ratePerMin: h.ratePerMin || 5,
    //   isOnCall: true,
    //   userId: String(h._id).slice(-8),
    //   languages: h.languages || ["Hindi"],
    //   about: h.about || "",
    //   interests: h.interests || [],
    // }));
    //old end
    //new
    const hosts = await Host.find({ isVerified: true })
      .select(
        "firstName lastName age gender profileImage images introVideo location",
      )
      .lean();

    const mapped = hosts.map((h) => ({
      id: h._id,
      name: `${h.firstName} ${h.lastName}`.trim(),
      firstName: h.firstName,
      age: h.age || null,
      gender: h.gender || null,
      profileImage: h.profileImage || null,
      images: (h.images || []).map((img) => img.url),
      video: h.introVideo || null,
      location: h.location || null,
      ratePerMin: h.ratePerMin || 5,
      isOnCall: true,
      userId: String(h._id).slice(-8),
      languages: h.languages || ["Hindi"],
      about: h.about || "",
      interests: h.interests || [],
    }));
    //new end

    res.json({ success: true, hosts: mapped });
  } catch (err) {
    console.error("public-hosts error:", err);
    res.status(500).json({ success: false, hosts: [] });
  }
});

module.exports = router;
