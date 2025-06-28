const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
const getRandom = () => {
  return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
};
const findUserWithEmail = async (email) => {
  return await User.findOne({ email });
};
const checkReferred = async (code) => {
  const user = await User.find({ referralCode: code });
  console.log("user: ", user);

  return !user;
};
exports.registerUser = async (req, res) => {
  const { fullName, email, password, role, codeBy } = req.body;
  console.log({ fullName, email, password, role, codeBy });

  if (!fullName || !email || !password) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }
  if (role === "staff") {
    if (codeBy) {
      const isCodeInvalid = await checkReferred(codeBy);
      if (isCodeInvalid) {
        return res.status(404).json({ message: "Mã code không tồn tại" });
      }
    }
  }
  try {
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const user = await User.create({
      fullName,
      email,
      password,
      role,
      referredBy: { code: codeBy ?? null },
    });
    console.log("Đăng kí user thành công");

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      accessToken: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      message: "Error register user",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login user: ", { email, password });
  if (!email || !password) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }
  try {
    const user = await findUserWithEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(404).json({
        message: "Tài khoản bị khóa tạm thời. Vui lòng thử lại sau.",
      });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();
        return res.status(404).json({
          message: "Tài khoản bị khóa tạm thời. Vui lòng thử lại sau.",
        });
      }
      await user.save();
      return res.status(401).json({ message: "Invalid email or password" });
    }
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      accessToken: generateToken(user._id),
    });
    console.log("Login user thành công");
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Error Login user",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

exports.verifyUser = async (req, res) => {
  const { email, key } = req.body;

  if (!email) {
    return res.status(404).json({ message: "Please fill in this field" });
  }
  try {
    const existingUser = await findUserWithEmail(email);
    if (key === "register" && existingUser) {
      return res.status(409).json({ message: "Tài khoản đã tồn tại." }); // 409 Conflict
    }

    if (key !== "register" && !existingUser) {
      return res.status(404).json({ message: "Tài khoản không tồn tại." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USERNAME_EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const code = getRandom();
    const mailOptions = {
      from: process.env.USERNAME_EMAIL,
      to: email,
      subject: "Mã xác thực của bạn",
      text: `Mã xác thực của bạn là: ${code}`,
    };
    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Lỗi gửi email:", error);
      } else {
        console.log("Email đã gửi:", info.response);
      }
    });
    res.status(201).json({
      code,
    });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    res.status(500).json({
      message: "Error verify user",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
exports.resetPassword = async (req, res) => {
  const { password, email } = req.body;
  if (!password || !email) {
    return res.status(400).json({ message: "Please fill in this fields." });
  }
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await User.updateOne({ email }, { password: hashPassword });
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "User not found or password unchanged." });
    }
    console.log("Update password successfully !!");

    res.status(200).json({
      message: "Update password successfully !!",
    });
  } catch (error) {
    console.error("Forgot error: ", error);
    res.status(500).json({
      message: "Forgot password error.",
      error: error.message,
    });
  }
};
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found !!!" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Get user info error: ", error);
    res.status(500).json({
      message: "Error get user info",
      error: error.message,
    });
  }
};
exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;

  return res.status(200).json({ profileImageUrl: imageUrl });
};
exports.getUserById = async (id) => {
  return await User.findById(id);
};
