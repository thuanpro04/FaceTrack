const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
const { generateReferralCode } = require("../untils/GenerationCode");
const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, default: null },
    profileImageUrl: { type: String, default: null },
    lockUntil: { type: Date },
    birthDay: { type: String },
    role: {
      type: String,
      enum: ["staff", "manage", "admin"],
      default: "staff",
    },
    failedLoginAttempts: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    gender: { type: String, enum: ["nam", "nữ", "khác"], default: "nam" },
    requestManages: [
      {
        type: String,
        ref: "Manage",
      },
    ],
    lastLogin: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
UserSchema.methods.comparePassword = async function (candidatePasswors) {
  return await bcrypt.compare(candidatePasswors, this.password);
};
module.exports = mongoose.model("User", UserSchema);
