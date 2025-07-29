const { default: mongoose } = require("mongoose");
const User = require("./User");

const staffSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  experience: { type: String, default: null },
  rating: { type: Number, default: 0 },
  currentStatus: { type: String, default: null },
  location: { type: String, default: null },
  skills: [
    {
      type: String,
      default: null,
    },
  ],
  bio: { type: String, default: null },
  totalWorkplaces: { type: Number, default: 0 },
  manageBy: {
    manageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manage",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  workInfo: {
    position: {
      type: String,
      default: null,
    },
    department: {
      type: String,
      default: null,
    },
    hiredDate: {
      type: Date,
      default: Date.now,
      // Ngay làm việc
    },
    salary: {
      type: Number,
      default: null,
    },
  },
});
module.exports = mongoose.model("Staff", staffSchema);
