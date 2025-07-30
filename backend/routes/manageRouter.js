const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getStaffInfo,
  handleInviteToGroup,
} = require("../controllers/manageController");

const manageRouter = express.Router();
manageRouter.get("/info/:limit", protect, getStaffInfo);
manageRouter.post("/invite", protect, handleInviteToGroup);
module.exports = manageRouter;
