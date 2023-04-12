const path = require("path");
const fs = require("fs/promises");

const User = require("../models/userModel");
const { catchAsync } = require("../utils/catchAsync");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

/**
 * Current user controller
 */
const getCurrentUser = catchAsync(async (req, res) => {
  const { name, email, subscription } = req.user;

  res.status(200).json({
    user: { name, email, subscription },
  });
});

/**
 * Update user password
 */
const updatePassword = (req, res) => {
  res.status(200).json({ user: req.user });
};

/**
 * Update user avatar controller
 */
const updateAvatar = catchAsync(async (req, res) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id: id } = req.user;
  const imageName = `${id}_${originalname}`;

  const resultUpload = path.join(avatarsDir, imageName);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("public", "avatars", imageName);
  await User.findByIdAndUpdate(req.user._id, { avatarURL });

  res.status(200).json({ avatarURL });
});

module.exports = { getCurrentUser, updatePassword, updateAvatar };