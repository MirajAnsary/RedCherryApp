// user-backend/controllers/paymentController.js
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── Recharge plan amounts (in ₹) — also used as talktime credits ─────────────
const PLAN_AMOUNTS = {
  single: 720,
  double: 1500,
  multiple: 3510,
};

const PLAN_LABELS = {
  single: "Single Host Room",
  double: "Double Host Room",
  multiple: "Multiple Host Room",
};

// ── POST /api/payment/create-order ────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const { planId, amount } = req.body;

    const expectedAmount = PLAN_AMOUNTS[planId];
    if (!expectedAmount) {
      return res.status(400).json({ success: false, message: "Invalid plan." });
    }
    if (amount !== expectedAmount) {
      return res
        .status(400)
        .json({ success: false, message: "Amount mismatch." });
    }

    const shortId = String(req.user._id).slice(-8);
    const shortTs = String(Date.now()).slice(-8);
    const receipt = `rc_${shortId}_${shortTs}`;

    const order = await razorpay.orders.create({
      amount: expectedAmount * 100,
      currency: "INR",
      receipt,
      notes: { userId: String(req.user._id), planId },
    });

    res.json({ success: true, order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("createOrder error:", err);
    res
      .status(500)
      .json({ success: false, message: "Could not create order." });
  }
};

// ── POST /api/payment/verify ──────────────────────────────────────────────────
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment details." });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature." });
    }

    // The signature only covers order_id|payment_id, so never trust planId /
    // amount from the client — read them from the order we created.
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const planId = order?.notes?.planId;
    const expectedAmount = PLAN_AMOUNTS[planId];
    if (
      !expectedAmount ||
      order.amount !== expectedAmount * 100 ||
      order.notes?.userId !== String(req.user._id)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid plan or amount." });
    }

    // Block replay: each payment can be credited only once
    if (await Transaction.exists({ razorpayPaymentId: razorpay_payment_id })) {
      return res
        .status(409)
        .json({ success: false, message: "Payment already credited." });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { talktimeBalance: expectedAmount } },
      { new: true },
    );

    await Transaction.create({
      userId: req.user._id,
      type: "credit",
      amount: expectedAmount,
      planId,
      planLabel: PLAN_LABELS[planId],
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "success",
      description: `Recharge — ${PLAN_LABELS[planId]}`,
    });

    res.json({
      success: true,
      message: "Balance credited.",
      newBalance: user.talktimeBalance,
    });
  } catch (err) {
    console.error("verifyPayment error:", err);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed." });
  }
};

// ── GET /api/payment/transactions ─────────────────────────────────────────────
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json({ success: true, transactions });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Could not fetch transactions." });
  }
};

// ── GET /api/payment/balance ──────────────────────────────────────────────────
// Returns current talktime balance for the logged-in user.
// Used by UserLiveRoomPage before joining a room to check if user can afford it.
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("talktimeBalance")
      .lean();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    res.json({ success: true, talktimeBalance: user.talktimeBalance });
  } catch (err) {
    console.error("getBalance error:", err);
    res
      .status(500)
      .json({ success: false, message: "Could not fetch balance." });
  }
};
