const express = require("express");

const router = express.Router();

const {
  getCurrentUser,
  updateAvatar,
  updatePassword,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddlewares");
const { upload, checkPassword } = require("../middlewares/userMiddlewares");

router.route("/current").post(protect, getCurrentUser);
router.route("/avatar").patch(protect, upload, updateAvatar);
router.route("/update-password").patch(protect, checkPassword, updatePassword);

module.exports = router;