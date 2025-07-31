const { default: mongoose } = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["invite", "message", "alter"],
    default: "invite",
  },
  content: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
  },
});
NotificationSchema.index({ sender: 1, receiver: 1 }, { unique: true });
module.exports = mongoose.model("NotificationInvite", NotificationSchema);
