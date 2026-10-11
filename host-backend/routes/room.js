// host-backend/routes/room.js
const express = require("express");
const router = express.Router();
const verifyHostToken = require("../middleware/verifyHostToken");
const {
  createRoom,
  getViewerToken,
  endRoom,
  getLiveRooms,
} = require("../controllers/roomController");

// Protected – host must be logged in
router.post("/create", verifyHostToken, createRoom);
router.post("/end/:channelName", verifyHostToken, endRoom);

// Public – anyone can call these (users joining rooms)
router.get("/live", getLiveRooms);
router.get("/token/:channelName", getViewerToken);

module.exports = router;
