const { default: mongoose, mongo } = require("mongoose");
const Attendance = require("./Attendance");
const daySchema = mongoose.Schema({
  startDay: {
    type: String,
    required: true,
  },
  endDay: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  isworkDay: {
    type: Boolean,
    required: true,
  },
  attendances: Attendance.schema,
});
const assignWorkSchema = mongoose.Schema({
  manageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Manage",
  },
  staffId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  workSchedule: {
    monDay: daySchema,
    tusDay: daySchema,
    wednesDay: daySchema,
    thursDay: daySchema,
    friDay: daySchema,
    saturDay: daySchema,
    sunDay: daySchema,
  },
});
