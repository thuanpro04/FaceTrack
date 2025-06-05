const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
const { generateReferralCode } = require("../untils/GenerationCode");
const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    lockUntil: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["admin", "staff", "leader"],
      default: "staff",
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: [
      {
        code: {
          type: String,
        },
        referredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    startTrialDate: { type: Date, default: Date.now },
    plan: {
      type: String,
      enum: ["trial", "premium"],
      default: "trial",
    }, // hoặc 'premium'
    planExpirationDate: {
      type: Date,
      default: null, // hoặc không cần khai báo default nếu muốn để undefined
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  if (["staff", "admin"].includes(this.role)) {
    this.startTrialDate = undefined;
    this.plan = undefined;
    this.planExpirationDate = undefined;
    this.referralCode = undefined;
  } else {
    this.referredBy = [];
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
    }
    if (!this.referralCode) {
      this.referralCode = generateReferralCode(); // bạn cần định nghĩa hàm này
    }
  }
  next();
});
UserSchema.methods.comparePassword = async function (candidatePasswors) {
  return await bcrypt.compare(candidatePasswors, this.password);
};
module.exports = mongoose.model("User", UserSchema);
