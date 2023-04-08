const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const { catchAsync, enums, AppError } = require("../utils");

/**
 * Sign jwt helper function
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

/**
 * Signup controller
 */
const signup = catchAsync(async (req, res) => {
  const newUserData = {
    ...req.body,
    role: enums.USER_ROLES_ENUM.STARTER,
  };
  const newUser = await User.create(newUserData);

  newUser.password = undefined;

  const token = signToken(newUser.id);

  res.status(201).json({
    user: newUser,
    token,
  });
});

/**
 * Login controller
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new AppError(401, "Not authorized"));

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
 * Current user controller
 */
const getCurrentUser = catchAsync(async (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    user: { email, subscription },
  });
});

module.exports = { signup, login, logout, getCurrentUser };