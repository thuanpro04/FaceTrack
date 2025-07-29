const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getStaffInfo } = require("../controllers/userController");
const manageRouter = express.Router();
manageRouter.get("/info/:limit", protect, getStaffInfo);
module.exports = manageRouter;
