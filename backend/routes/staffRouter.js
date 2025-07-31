const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getManageInfo,
  getNotifiForUser,
  handleRejectInviteToManage,
  handleAgreeInviteToManage,
} = require("../controllers/staffController");
const staffRouter = express.Router();
staffRouter.get("/info/:id", protect, getManageInfo);
staffRouter.get("/noti/:id", protect, getNotifiForUser);
staffRouter.get("/reject/:id", protect, handleRejectInviteToManage);
staffRouter.post("/agree", protect, handleAgreeInviteToManage);
module.exports = staffRouter;
