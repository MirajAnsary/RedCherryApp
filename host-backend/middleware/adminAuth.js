// host-backend/middleware/adminAuth.js
// Protects all /api/host/admin/* routes.
// Requests carry the session token from POST /api/host/admin/login
// in the "x-admin-key" header.
const jwt = require("jsonwebtoken");

function adminAuth(req, res, next) {
  const adminKey = req.headers["x-admin-key"];
  try {
    const payload = jwt.verify(adminKey || "", process.env.JWT_SECRET);
    if (payload.role !== "host-admin") throw new Error("wrong role");
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Please sign in again." });
  }
}

module.exports = adminAuth;
