const express = require("express");
const {
  registerUser,
  loginUser,
  verifyUser,
  resetPassword,
  getUserInfo,
} = require("../controllers/AuthController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleWare");
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.post("/reset", resetPassword);
router.get("/getUser", protect, getUserInfo);
module.exports = router;
