//host-backend
// services/tokenService.js
const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh";

/**
 * Generate access token — short-lived (15 min)
 */
function generateAccessToken(host) {
  return jwt.sign(
    { id: host._id, role: "host", phone: host.phoneNumber },
    ACCESS_SECRET,
    { expiresIn: "15m" },
  );
}

/**
 * Generate refresh token — long-lived (7 days)
 */
function generateRefreshToken(host) {
  return jwt.sign({ id: host._id, role: "host" }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

/**
 * Verify access token
 */
function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

/**
 * Verify refresh token
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

/**
 * Set refresh token as HTTP-only cookie
 */
function setRefreshCookie(res, token) {
  res.cookie("rc_refresh_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

/**
 * Clear refresh token cookie
 */
function clearRefreshCookie(res) {
  res.clearCookie("rc_refresh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
};
