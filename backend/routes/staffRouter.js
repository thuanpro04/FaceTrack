const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getManageInfo } = require("../controllers/staffController");
const staffRouter = express.Router();
staffRouter.get("/info/:id", protect, getManageInfo);
module.exports = staffRouter;
