const express = require("express");
const {
  registerUser,
  loginUser,
  verifyUser,
  resetPassword,
  getUserInfo,
  upload_Profile,upload_Code
} = require("../controllers/AuthController");
const { protect, limiter } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", limiter, loginUser);
router.post("/verify", verifyUser);
router.post("/reset", resetPassword);
router.get("/getUser", protect, getUserInfo);
router.put("/me", limiter, upload_Profile);
router.put("/code", limiter, upload_Code);
module.exports = router;
