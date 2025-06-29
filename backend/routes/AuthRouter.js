const express = require("express");
const {
  registerUser,
  loginUser,
  verifyUser,
  resetPassword,
  getUserInfo,
  upload_Profile,
} = require("../controllers/AuthController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.post("/reset", resetPassword);
router.get("/getUser", protect, getUserInfo);
router.post("/upload", upload_Profile)
module.exports = router;
