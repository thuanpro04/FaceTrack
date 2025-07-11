const { getUserById, getManageInfoReferred } = require("./AuthController");

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
