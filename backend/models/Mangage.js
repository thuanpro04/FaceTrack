const { generateReferralCode } = require("../untils/GenerationCode");
const origanizationsSchema = require("./Origanizations");
const User = require("./User");

const manageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  refferalCode: {
    type: String,
    required: true,
    unique: true,
  },
  startTrialDate: {
    type: Date,
    default: Date.now,
  },
  plan: {
    type: String,
    enum: ["trial", "premium"],
    default: "trial",
  },
  planExpirationDate: { type: Date, default: null },
  origanizations: origanizationsSchema,
});
manageSchema.prev("save", async function (next) {
  if (!this.planExpirationDate) {
    if (this.plan === "trial") {
      this.planExpirationDate = new Date(
        this.startTrialDate.getTime() + 30 * 24 * 60 * 60 * 1000
      );
    } else if (this.plan === "premium") {
      // Hết hạn sau 1 năm
      this.planExpirationDate = new Date(
        this.startTrialDate.getTime() + 365 * 24 * 60 * 60 * 1000
      );
      // Hoặc sau 1 tháng: 30 * 24 * 60 * 60 * 1000
    }
    if (!this.referralCode) {
      this.referralCode = generateReferralCode(); // bạn cần định nghĩa hàm này
    }
  }
  next();
});
module.exports = mongoose.model("Manage", manageSchema);
