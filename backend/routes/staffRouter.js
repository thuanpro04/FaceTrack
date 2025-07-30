const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getManageInfo,
  getNotificationInviteToTeam,
} = require("../controllers/staffController");
const staffRouter = express.Router();
staffRouter.get("/info/:id", protect, getManageInfo);
staffRouter.get("/invite/:id", protect, getNotificationInviteToTeam);
module.exports = staffRouter;
