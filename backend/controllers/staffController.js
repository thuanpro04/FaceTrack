const Manage = require("../models/Manage");
const NotificationInvite = require("../models/NotificationInvite");
const Staff = require("../models/Staff");
const User = require("../models/User");
const { getUserById, getManageInfoReferred } = require("./AuthController");
const { createNotification } = require("./manageController");
exports.getManageInfo = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "Missing required fields: id" });
    }
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        message: "user not found !!",
      });
    }
    const manageInfoPromises = user.requestManages.map(
      (item) => getManageInfoReferred(item.referralCode) // Không cần await ở đây
    );
    // Lọc ra những mã giới thiệu hợp lệ
    const manages = await Promise.all(manageInfoPromises);
    const manageInfo = manages.filter((manage) => manage !== null);
    console.log("manage: ", manageInfo);

    res.status(200).json({
      message: "get manage info successfully",
      manageInfo,
    });
  } catch (error) {
    console.log("get manage info error: ", error);
    return res.status(500).json({
      message: "get manage server error",
    });
  }
};
exports.getNotifiForUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        message: "Missing required field id",
      });
    }
    const notifications = await NotificationInvite.find({
      receiver: id,
    });

    if (notifications.length < 1) {
      return res.status(200).json({ result: [], message: "No invites found" });
    }

    const manageInfo = notifications.map(async (item) => {
      const userInfo = await Manage.findOne({ user: item.sender }).populate({
        path: "user",
        select: "fullName profileImageUrl phone email gender",
      });

      return {
        notifications: item,
        manages: {
          fullName: userInfo.user.fullName,
          profileImageUrl: userInfo.user.profileImageUrl,
          phone: userInfo.user.phone,
          email: userInfo.user.email,
          gender: userInfo.user.gender,
          referralCode: userInfo.referralCode,
        },
      };
    });
    const manages = await Promise.all(manageInfo);
    console.log("Get notification invite successfully ");
    res.status(200).json({
      message: "Get notification invite successfully !!",
      result: manages,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Server get invite to team error: ${error}`,
    });
  }
};
exports.handleRejectInviteToManage = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "Missing required field: id" });
    }
    const noti = await NotificationInvite.findById(id);
    if (!noti) {
      return res.status(404).json({
        message: "Notification invite not found !!!",
      });
    }
    const user = await getUserById(noti.receiver);

    await createNotification(
      noti.receiver,
      noti.sender,
      `${user.fullName} đã từ chối vào nhóm`,
      "message"
    );
    await NotificationInvite.findByIdAndDelete(id);
    console.log("Reject invite successfully !!");

    res.status(200).json({
      message: "Reject invite successfully !!",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Reject invite to manage server error:${error}`,
    });
  }
};
exports.handleAgreeInviteToManage = async (req, res) => {
  const { id, code, userId } = req.body;
  try {
    // 2. Tìm staff theo userId
    const [noti, user, staff] = await Promise.all([
      NotificationInvite.findById(id),
      getUserById(userId),
      Staff.findOne({ user: userId }),
    ]);

    if (!noti) {
      return res.status(404).json({ message: "Notification not found" });
    }
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "Staff not found with user id" });
    }
    const manage = await Manage.findOne({ user: noti.sender });
    if (!manage) {
      return res.status(404).json({
        message: "Manage not found !!!",
      });
    }
    // 3. Kiểm tra xem tồn tại mã code đó trong request chưa rồi thì xóa
    user.requestManages = user.requestManages.filter(
      (item) => item.referralCode !== code
    );

    manage.requestStaff = manage.requestStaff.filter(
      (item) => item.user.toString() !== userId.toString()
    );

    // Lưu
    staff.manageBy.push({ manageId: noti.sender });
    manage.staffs.push({ userId });
    // Lưu thay đổi song song
    await Promise.all([
      user.save(),
      staff.save(),
      manage.save(),
      NotificationInvite.findByIdAndDelete(id)
    ]);
    
    await createNotification(
      noti.receiver,
      noti.sender,
      `${user.fullName} đã đồng ý vào team 👏`,
      "message"
    );
    res.status(200).json({
      message: "Agree to group successfully!!",
    });
  } catch (error) {
    console.error("Upload code error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
