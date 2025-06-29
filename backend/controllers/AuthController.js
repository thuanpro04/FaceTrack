const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const {
  getShortName,
  generateReferralCode,
} = require("../untils/GenerationCode");
const Mangage = require("../models/Manage");
const Manage = require("../models/Manage");
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
  const manage = await Manage.find({ referralCode: code });
  return manage[0]._id;
};
exports.registerUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  console.log({ fullName, email, password, role });

  if (!fullName || !email || !password) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
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
    });

    if (role === "manage") {
      await Mangage.create({
        user: user._id,
      });
    }
    console.log("Đăng kí user thành công");

    res.status(201).json({
      _id: user._id,
      fullName: getShortName(user.fullName),
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
      fullName: getShortName(user.fullName),
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
      tls: {
        rejectUnauthorized: false, // Bỏ qua kiểm tra chứng chỉ
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

exports.getUserById = async (id) => {
  return await User.findById(id);
};
exports.upload_Profile = async (req, res) => {
  const user = req.body;
  try {
    const existingUser = await this.getUserById(user.id);
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found !!",
      });
    }
    const result = await User.findByIdAndUpdate(user.id, user, {
      new: true, // Trả về document sau khi update (default: false)
      runValidators: true, // Chạy validation trước khi update
      select: "fullName email phone profileImageUrl status role",
      select: "-password",
    });
    console.log("Update success: ", result);

    res.status(201).json({
      message: "Update user info success !!!",
      date: result,
    });
  } catch (error) {
    console.log("Upload profile error: ", error);
    return res.status(500).json({
      message: "upload fail server",
    });
  }
};
exports.upload_Code = async (req, res) => {
  const { id, code } = req.body;
  console.log({ id, code });

  // Validate input
  if (!id || !code) {
    return res
      .status(400)
      .json({ message: "Missing required fields: id or code" });
  }

  try {
    // 1. Kiểm tra mã giới thiệu (sử dụng findOne để tránh sai logic)
    const referrer = await Manage.findOne({ refferalCode: code });
    if (!referrer) {
      return res.status(400).json({ message: "Referral code does not exist" });
    }

    // 2. Kiểm tra user tồn tại
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.requestManages.includes(code)) {
      return res.status(201).json({
        message: "Code already existing in user",
      });
    }
    // 3. Cập nhật song song (dùng Promise.all để tối ưu tốc độ)
    const [updatedManage, updatedUser] = await Promise.all([
      Manage.findByIdAndUpdate(
        referrer._id,
        { requestStaff: code },
        { new: true } // Trả về document sau khi update
      ),
      User.findByIdAndUpdate(user._id, { requestManages: code }, { new: true }),
    ]);

    // 4. Kiểm tra kết quả cập nhật
    if (!updatedManage || !updatedUser) {
      throw new Error("Failed to update documents");
    }
    console.log("Referral code updated successfully");

    // 5. Trả về response thành công
    res.status(200).json({
      message: "Referral code updated successfully",
      data: {
        manage: updatedManage.requestStaff,
        user: updatedUser.requestManages,
      },
    });
  } catch (error) {
    console.error("Upload code error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message, // Chỉ trả về error.message trong môi trường dev
    });
  }
};
