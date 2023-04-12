const express = require("express");

const router = express.Router();

const {
  signup,
  verifyEmail,
  resendVerifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const {
  checkSignupData,
  checkLoginData,
  protect,
} = require("../middlewares/authMiddlewares");

router.route("/signup").post(checkSignupData, signup);
router.route("/login").post(checkLoginData, login);
router.route("/logout").post(protect, logout);
router.route("/verify").post(resendVerifyEmail);
router.route("/verify/:verificationToken").get(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:otp").patch(resetPassword);

module.exports = router;