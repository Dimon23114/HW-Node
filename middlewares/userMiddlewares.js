const multer = require("multer");
const path = require("path");
const User = require("../models/userModel");
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/errorHandler");

const tempDir = path.join(__dirname, "../", "temp");

/**
 * Upload user avatar
 */
const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 2048,
  },
});

const upload = multer({
  storage: multerConfig,
}).single("avatar");

/**
 * Update user password
 */
const checkPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("password");

  if (!(await user.checkPassword(currentPassword, user.password))) {
    return next(new AppError(401, "Current password is wrong"));
  }
  user.password = newPassword;

  await user.save();

  next();
});

module.exports = { upload, checkPassword };