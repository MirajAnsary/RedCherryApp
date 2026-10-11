// user-backend/routes/manualRecharge.js
// Mount in server.js: app.use("/api/recharge", require("./routes/manualRecharge"));

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth_middleware");
const {
  submitRecharge,
  getMyRecharges,
} = require("../controllers/manualRechargeController");

// All user routes require JWT auth
router.post("/manual/submit", protect, submitRecharge);
router.get("/manual/my", protect, getMyRecharges);

module.exports = router;
