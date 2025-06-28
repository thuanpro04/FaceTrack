exports.generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
exports.getShortName = (fullName) => {
  if (!fullName) return "";
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) return parts[0];
  // Lấy 2 từ cuối (tên + tên đệm cuối), hoặc chỉ tên cuối nếu muốn ngắn nhất
  return parts.slice(-2).join(" ");
};
