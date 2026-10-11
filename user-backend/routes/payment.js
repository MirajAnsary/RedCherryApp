// user-backend/routes/payment.js
const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getTransactions,
  getBalance,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth_middleware");

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/transactions", protect, getTransactions);

// ── GET /api/payment/balance ──────────────────────────────────────────────────
// Returns current talktime balance for the logged-in user
router.get("/balance", protect, getBalance);

module.exports = router;
