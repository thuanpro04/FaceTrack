const jwt = require("jsonwebtoken");
const User = require("../models/User");
const rateLimit = require("express-rate-limit");
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
exports.limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: "Too many requests from this IP, please try again later",
});
