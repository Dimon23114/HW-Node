const express = require("express");

const router = express.Router();

const {
  getCurrentUser,
  updateAvatar,
} = require("../controllers/userController");
const { protect } = require("../../middlewares/authMiddlewares");
const upload = require("../../middlewares/uploadMiddlewares");

router.route("/current").post(protect, getCurrentUser);
router.route("/avatar").patch(protect, upload, updateAvatar);

module.exports = router;