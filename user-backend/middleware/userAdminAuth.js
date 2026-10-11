// user-backend/middleware/userAdminAuth.js
// Admin requests carry the session token from POST /api/admin/users/login
// in the "x-admin-key" header.
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const key = req.headers["x-admin-key"];
  try {
    const payload = jwt.verify(key || "", process.env.JWT_SECRET);
    if (payload.role !== "user-admin") throw new Error("wrong role");
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Please sign in again." });
  }
};
