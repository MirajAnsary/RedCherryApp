// user-backend/routes/rooms.js
const express = require("express");
const router = express.Router();
const { getLiveRooms, getRoomToken } = require("../controllers/roomController");

// Public — no auth needed to browse rooms or get a viewer token
router.get("/live", getLiveRooms);
router.get("/token/:channelName", getRoomToken);

module.exports = router;
