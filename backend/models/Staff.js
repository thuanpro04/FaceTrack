const { default: mongoose } = require("mongoose");
const User = require("./User");

const staffSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  manageBy: {
    manageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manage",
      required: true,
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
