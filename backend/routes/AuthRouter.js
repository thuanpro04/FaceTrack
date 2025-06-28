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
router.post("/upload-avatar", (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded image" });
  }
  const profileImageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ profileImageUrl });
});
module.exports = router;
