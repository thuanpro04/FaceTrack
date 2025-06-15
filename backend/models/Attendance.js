const mongoose = require("mongoose");
const attentdanceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed"],
    },
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalAttendees: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Attendance = mongoose.model("Attendance", attentdanceSchema);
module.exports = Attendance;
