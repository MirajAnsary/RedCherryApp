//host-backend
// controllers/profileController.js
const path = require("path");
const fs = require("fs");
const Host = require("../models/Host");
const Withdrawal = require("../models/Withdrawal");

// ── Helper: save uploaded file ─────────────────────────────────────────────
function saveFile(file, folder) {
  const dir = path.join(__dirname, `../uploads/${folder}`);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const ext = path.extname(file.originalname) || ".bin";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const dest = path.join(dir, filename);
  fs.renameSync(file.path, dest);
  // return `/uploads/${folder}/${filename}`;
  return `/host-uploads/${folder}/${filename}`;
}

// ── Update name ─────────────────────────────────────────────────────────────
async function updateName(req, res) {
  try {
    const { firstName, lastName } = req.body;
    if (!firstName?.trim())
      return res
        .status(400)
        .json({ success: false, message: "First name required." });
    req.hostUser.firstName = firstName.trim();
    req.hostUser.lastName = (lastName || "").trim();
    await req.hostUser.save();
    return res.json({ success: true, user: req.hostUser.toPublicProfile() });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Upload avatar ───────────────────────────────────────────────────────────
async function uploadAvatar(req, res) {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    const url = saveFile(req.file, "avatars");
    req.hostUser.profileImage = url;
    await req.hostUser.save();
    return res.json({ success: true, profileImage: url });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Delete avatar ───────────────────────────────────────────────────────────
async function deleteAvatar(req, res) {
  try {
    req.hostUser.profileImage = null;
    await req.hostUser.save();
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Get images ──────────────────────────────────────────────────────────────
async function getImages(req, res) {
  return res.json({ success: true, images: req.hostUser.images || [] });
}

// ── Add image ───────────────────────────────────────────────────────────────
async function addImage(req, res) {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    const url = saveFile(req.file, "images");
    req.hostUser.images.push({ url });
    await req.hostUser.save();
    const newImg = req.hostUser.images[req.hostUser.images.length - 1];
    return res.json({ success: true, image: newImg });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Replace image ───────────────────────────────────────────────────────────
async function replaceImage(req, res) {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    const img = req.hostUser.images.id(req.params.imageId);
    if (!img)
      return res
        .status(404)
        .json({ success: false, message: "Image not found." });
    const url = saveFile(req.file, "images");
    img.url = url;
    await req.hostUser.save();
    return res.json({ success: true, image: img });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Delete image ─────────────────────────────────────────────────────────────
async function deleteImage(req, res) {
  try {
    req.hostUser.images = req.hostUser.images.filter(
      (img) => img._id.toString() !== req.params.imageId,
    );
    await req.hostUser.save();
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Get video ────────────────────────────────────────────────────────────────
async function getVideo(req, res) {
  return res.json({ success: true, videoUrl: req.hostUser.introVideo || null });
}

// ── Upload video ─────────────────────────────────────────────────────────────
async function uploadVideo(req, res) {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    const url = saveFile(req.file, "videos");
    req.hostUser.introVideo = url;
    await req.hostUser.save();
    return res.json({ success: true, videoUrl: url });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Delete video ─────────────────────────────────────────────────────────────
async function deleteVideo(req, res) {
  try {
    req.hostUser.introVideo = null;
    await req.hostUser.save();
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Get audition video ───────────────────────────────────────────────────────
async function getAuditionVideo(req, res) {
  return res.json({
    success: true,
    videoUrl: req.hostUser.auditionVideo || null,
  });
}

// ── Upload audition video ────────────────────────────────────────────────────
async function uploadAuditionVideo(req, res) {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    const url = saveFile(req.file, "videos");
    req.hostUser.auditionVideo = url;
    await req.hostUser.save();
    return res.json({ success: true, videoUrl: url });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Delete audition video ────────────────────────────────────────────────────
async function deleteAuditionVideo(req, res) {
  try {
    req.hostUser.auditionVideo = null;
    await req.hostUser.save();
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Get KYC ──────────────────────────────────────────────────────────────────
async function getKYC(req, res) {
  return res.json({ success: true, kyc: req.hostUser.kyc });
}

// ── Upload KYC doc ───────────────────────────────────────────────────────────
async function uploadKYCDoc(req, res) {
  try {
    const { docType } = req.body;
    const validTypes = [
      "aadhaarFront",
      "aadhaarBack",
      "voterFront",
      "voterBack",
    ];
    if (!validTypes.includes(docType))
      return res
        .status(400)
        .json({ success: false, message: "Invalid document type." });
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    const url = saveFile(req.file, "kyc");
    req.hostUser.kyc[docType] = url;
    await req.hostUser.save();
    return res.json({ success: true, url, docType });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Delete KYC doc ───────────────────────────────────────────────────────────
async function deleteKYCDoc(req, res) {
  try {
    const { docType } = req.params;
    const validTypes = [
      "aadhaarFront",
      "aadhaarBack",
      "voterFront",
      "voterBack",
    ];
    if (!validTypes.includes(docType))
      return res
        .status(400)
        .json({ success: false, message: "Invalid document type." });
    req.hostUser.kyc[docType] = null;
    await req.hostUser.save();
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Submit KYC ───────────────────────────────────────────────────────────────
async function submitKYC(req, res) {
  try {
    const k = req.hostUser.kyc;
    if (!k.aadhaarFront || !k.aadhaarBack || !k.voterFront || !k.voterBack)
      return res.status(400).json({
        success: false,
        message: "Please upload all 4 documents first.",
      });
    req.hostUser.kyc.status = "submitted";
    req.hostUser.kyc.submittedAt = new Date();
    await req.hostUser.save();
    return res.json({
      success: true,
      message: "KYC submitted for verification.",
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Get bank ─────────────────────────────────────────────────────────────────
async function getBankDetails(req, res) {
  const b = req.hostUser.bank;
  return res.json({
    success: true,
    bank: {
      accountHolderName: b?.accountHolderName || "",
      accountNumber: b?.accountNumber ? "••••" + b.accountNumber.slice(-4) : "",
      ifscCode: b?.ifscCode || "",
      bankName: b?.bankName || "",
      hasBank: !!b?.accountNumber,
    },
  });
}

// ── Save bank ─────────────────────────────────────────────────────────────────
async function saveBankDetails(req, res) {
  try {
    const {
      accountHolderName,
      accountNumber,
      confirmAccountNumber,
      ifscCode,
      bankName,
    } = req.body;
    if (!accountHolderName?.trim())
      return res
        .status(400)
        .json({ success: false, message: "Account holder name required." });
    if (!accountNumber)
      return res
        .status(400)
        .json({ success: false, message: "Account number required." });
    if (accountNumber !== confirmAccountNumber)
      return res
        .status(400)
        .json({ success: false, message: "Account numbers do not match." });
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifscCode))
      return res
        .status(400)
        .json({ success: false, message: "Invalid IFSC code format." });
    if (!bankName?.trim())
      return res
        .status(400)
        .json({ success: false, message: "Bank name required." });

    req.hostUser.bank = {
      accountHolderName: accountHolderName.trim(),
      accountNumber,
      ifscCode: ifscCode.toUpperCase(),
      bankName: bankName.trim(),
      addedAt: new Date(),
    };
    await req.hostUser.save();
    return res.json({
      success: true,
      message: "Bank details saved successfully.",
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Withdraw ──────────────────────────────────────────────────────────────────
async function withdraw(req, res) {
  try {
    const amount = Number(req.body.amount);
    if (!amount || amount < 100)
      return res
        .status(400)
        .json({ success: false, message: "Minimum withdrawal is ₹100." });
    if (amount > req.hostUser.earnings)
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance." });
    if (!req.hostUser.bank?.accountNumber)
      return res
        .status(400)
        .json({ success: false, message: "Please add bank details first." });

    req.hostUser.earnings -= amount;
    await req.hostUser.save();

    const w = await Withdrawal.create({
      hostId: req.hostUser._id,
      amount,
      status: "pending",
    });
    return res.json({
      success: true,
      message: "Withdrawal request submitted.",
      remainingBalance: req.hostUser.earnings,
      withdrawalId: w._id,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Withdrawal history ────────────────────────────────────────────────────────
async function withdrawalHistory(req, res) {
  try {
    const history = await Withdrawal.find({ hostId: req.hostUser._id }).sort({
      createdAt: -1,
    });
    const totalWithdrawn = history
      .filter((w) => w.status === "success")
      .reduce((s, w) => s + w.amount, 0);
    const totalPending = history
      .filter((w) => w.status === "pending")
      .reduce((s, w) => s + w.amount, 0);
    return res.json({ success: true, totalWithdrawn, totalPending, history });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ── Get all verified hosts (public circle) ──────────────────────────────────
async function getHosts(req, res) {
  try {
    const currentId = req.hostUser?._id;
    const hosts = await Host.find(
      { isVerified: true, _id: { $ne: currentId } },
      { firstName: 1, profileImage: 1 },
    )
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const list = hosts.map((h) => ({
      id: h._id,
      name: h.firstName,
      profileImage: h.profileImage || null,
      initials: h.firstName ? h.firstName[0].toUpperCase() : "H",
    }));

    return res.json({ success: true, hosts: list });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

module.exports = {
  updateName,
  uploadAvatar,
  deleteAvatar,
  getImages,
  addImage,
  replaceImage,
  deleteImage,
  getVideo,
  uploadVideo,
  deleteVideo,
  getAuditionVideo,
  uploadAuditionVideo,
  deleteAuditionVideo,
  getKYC,
  uploadKYCDoc,
  deleteKYCDoc,
  submitKYC,
  getBankDetails,
  saveBankDetails,
  withdraw,
  withdrawalHistory,
  getHosts,
};
