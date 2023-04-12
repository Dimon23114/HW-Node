const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const uuid = require("uuid").v4;
const crypto = require("crypto");
require("dotenv").config();

const User = require("../models/userModel");
const { AppError } = require("../utils/errorHandler");
const { catchAsync } = require("../utils/catchAsync");
const enums = require("../constants/enums");
const sendMail = require("../utils/sendEmail");

const { JWT_SECRET, JWT_EXPIRES } = process.env;

/**
 * Sign jwt helper function
 */
const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

/**
 * Signup controller
 */
const signup = catchAsync(async (req, res) => {
  const avatarURL = gravatar.url(req.body.email);
  const { name, email } = req.body;
  const verificationToken = uuid();

  const newUserData = {
    ...req.body,
    avatarURL,
    verificationToken,
    role: enums.USER_ROLES_ENUM.STARTER,
  };

  const newUser = await User.create(newUserData);

  newUser.password = undefined;

  const token = signToken(newUser.id);

  await sendMail(name, email, verificationToken);

  res.status(201).json({
    user: newUser,
    token,
  });
});

/**
 * Verification user controller
 */
const verifyEmail = catchAsync(async (req, res, next) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) return next(new AppError(404, "User not found"));

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.status(200).json({ message: "Verification successful" });
});

/**
 * Resend the email controller
 */
const resendVerifyEmail = catchAsync(async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(new AppError(404, "User not found"));
  if (user.verify)
    return next(new AppError(400, "Verification has already been passed"));

  await sendMail(name, email, user.verificationToken);

  res.status(200).json({ message: "Verification email sent" });
});

/**
 * Login controller
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new AppError(401, "Not authorized"));

  if (!user.verify) return next(new AppError(401, "User not found"));

  const passwordIsValid = await user.checkPassword(password, user.password);

  if (!passwordIsValid) return next(new AppError(401, "Not authorized"));

  user.password = undefined;

  const token = signToken(user.id);

  await User.findByIdAndUpdate(user.id, { token });

  res.status(200).json({
    user,
    token,
  });
});

/**
 * Logout controller
 */
const logout = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findByIdAndUpdate(id, { token: null });

  if (!user) return next(new AppError(401, "Not authorized"));

  res.status(204).json("No Content");
});

/**
 * Forgot password controller
 */
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(new AppError(404, "There is no user with this email"));

  const otp = user.createPasswordResetToken();

  await user.save({
    validateBeforeSave: false,
  });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/forgot-password/${otp}`;
  console.log(resetUrl);

/**
 * /Send reset url to the user email
 */

  res.sendStatus(200);
});

/**
 * Reset password controller
 */
const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.otp)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError(400, "Token is invalid"));

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  user.password = undefined;

  res.status(200).json({ user });
});

module.exports = {
  signup,
  verifyEmail,
  resendVerifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
};