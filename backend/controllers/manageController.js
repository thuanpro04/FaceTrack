const Manage = require("../models/Manage");
const NotificationInvite = require("../models/NotificationInvite");
const Staff = require("../models/Staff");
const User = require("../models/User");
const { getUserById, getManageInfoReferred } = require("./AuthController");
exports.getStaffInfo = async (req, res) => {
  const { limit } = req.params;

  if (!limit) {
    return res.status(400).json({
      message: "Missing required fields: limit",
    });
  }
  try {
    const staffs = await Staff.find().limit(limit).populate({
      path: "user",
      select: "-password",
      select:
        "fullName email phone profileImageUrl status role location birthDay gender",
    });
    // Trả về mảng thông tin cơ bản của user trong staff

    const basicStaffs = staffs.map((staff) => ({
      _id: staff.user,
      fullName: staff.user?.fullName,
      email: staff.user?.email,
      phone: staff.user?.phone,
      profileImageUrl: staff.user?.profileImageUrl,
      status: staff.user?.status,
      location: staff.user.location,
      birthDay: staff.user.birthDay,
      gender: staff.user.gender,
      staff: {
        role: staff.user?.role,
        experience: staff.experience,
        rating: staff.rating,
        currentStatus: staff.currentStatus,
        skills: staff.skills,
        bio: staff.bio,
        totalWorkplaces: staff.totalWorkplaces,
      },
    }));

    return res.status(200).json({
      message: "get staff info successfully",
      staffs: basicStaffs,
    });
  } catch (error) {
    return res.status(500).json({
      message: "get staff info server error",
    });
  }
};
exports.createNotification = async (senderId, receiverId, content, type) => {
  await NotificationInvite.create({
    sender: senderId,
    receiver: receiverId,
    content,
    type,
  });
  console.log("Create notifi successfully: ", senderId, receiverId);
};
exports.handleInviteToGroup = async (req, res) => {
  const { id, userId } = req.body;
  try {
    if (!id || !userId) {
      return res.status(400).json({
        message: "Missing required fields: id && userId",
      });
    }
    const manage = await Manage.findOne({ user: id }).populate({
      path: "user",
      select: "fullName",
    });
    if (!manage) {
      return res.status(404).json({
        message: "Manage not found !!!",
      });
    }
    if (manage.staffs.some((item) => item.userId.equals(userId))) {
      return res.status(200).json({
        message: "UserId already existing !!!",
      });
    }
    const existingNoti = await NotificationInvite.findOne({
      sender: id,
      receiver: userId,
    });
    if (existingNoti) {
      return res.status(200).json({
        message: "You have already sent the invitation.",
      });
    }
    // await NotificationInvite.create({
    //   sender: id,
    //   receiver: userId,
    //   content: `Bạn được mời vào nhóm bởi quản lý ${manage.fullName}`,
    // });
    await this.createNotification(
      id,
      userId,
      `Bạn được mời vào nhóm bởi quản lý ${manage.fullName}`,
      "invite"
    );
    console.log("Invite user to group successfully");

    res.status(200).json({
      message: "Invite user to group successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Invite user to group server error: ${error}`,
    });
  }
};
