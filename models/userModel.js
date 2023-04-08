const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const { enums } = require("../utils");

const userSchema = new Schema(
  {
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

const User = model("User", userSchema);

module.exports = User;