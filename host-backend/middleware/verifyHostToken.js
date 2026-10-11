//host-backend
// middleware/verifyHostToken.js
const { verifyAccessToken } = require("../services/tokenService");
const Host = require("../models/Host");

module.exports = async function verifyHostToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res
        .status(401)
        .json({ success: false, message: "No token provided." });

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Access token expired. Please refresh.",
          code: "TOKEN_EXPIRED",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please sign in again.",
      });
    }

    // ✅ Use .exec() to ensure a real Mongoose document (with .save())
    const host = await Host.findById(decoded.id).exec();
    if (!host)
      return res
        .status(401)
        .json({ success: false, message: "Host not found." });

    req.hostUser = host;
    next();
  } catch (err) {
    console.error("verifyHostToken error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Authentication error." });
  }
};
