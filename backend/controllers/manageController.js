const Staff = require("../models/Staff");
const { getUserById, getManageInfoReferred } = require("./AuthController");
exports.getStaffInfo = async (req, res) => {
  const { limit } = req.params;

  if (!limit) {
    return res.status(400).json({
      message: "Missing required fields: id",
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
      _id: staff._id,
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
