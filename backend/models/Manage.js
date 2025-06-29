const { default: mongoose } = require("mongoose");
const { generateReferralCode } = require("../untils/GenerationCode");
const origanizationsSchema = require("./Origanizations");
const User = require("./User");

const manageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  requestStaff: [
    {
      type: String,
      ref: "User",
    },
  ],
  refferalCode: {
    type: String,
    unique: true,
    index: true,
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
manageSchema.pre("save", async function (next) {
  if (!this.planExpirationDate) {
    if (this.plan === "trial") {
      this.planExpirationDate = new Date(
        this.startTrialDate.getTime() + 30 * 24 * 60 * 60 * 1000
      );
    } else if (this.plan === "premium") {
      this.planExpirationDate = new Date(
        this.startTrialDate.getTime() + 365 * 24 * 60 * 60 * 1000
      );
    }
    if (!this.refferalCode) {
      this.refferalCode = generateReferralCode();
    }
  }
  next();
});

module.exports = mongoose.model("Manage", manageSchema);
