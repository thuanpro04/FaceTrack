const mongoose = require("mongoose");
const attendanceRecordSchema = new mongoose.Schema(
  {
    attendanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendance",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkIntime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "late", "absent"],
      required: true,
    },
    recognitionConfidence: {
      type: Number,
      min: 0,
      max: 1,
      required: true,
      //   Độ tin cậy của nhận diện khuôn mặt
    },
    location: {
      type: {
        latitude: Number,
        longitube: Number,
      },
    },
    imageUrl: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
// Tạo compound index để đảm bảo mỗi user chỉ điểm danh 1 lần cho 1 phiên
attendanceRecordSchema.index({ attendance: 1, user: 1 });
const AttendanceRecord = mongoose.model(
  "AttendanceRecord",
  attendanceRecordSchema
);
module.exports = AttendanceRecord;
