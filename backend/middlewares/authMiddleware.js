const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");
const connectDb = require("../config/mongodb");
const { scheduleCleanupOldFiles } = require("../controllers/FaceController");
exports.protect = async (req, res, next) => {
  let accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};


