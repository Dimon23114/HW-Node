const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const enums = require("../constants/enums");

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      required: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, "Set password for user"],
      select: false,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "User with this email already exists"],
    },
    subscription: {
      type: String,
      enum: Object.values(enums.USER_ROLES_ENUM),
      default: enums.USER_ROLES_ENUM.STARTER,
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// Mongoose pre-save hook
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Mongoose custom method
userSchema.methods.checkPassword = (candidate, hash) =>
  bcrypt.compare(candidate, hash);

// Method to request password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const User = model("User", userSchema);

module.exports = User;