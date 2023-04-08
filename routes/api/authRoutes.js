const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/authController");

const { checkSignupData, protect } = require("../middlewares/authMiddlewares");

router.route("/users/signup").post(checkSignupData, signup);
router.route("/users/login").post(login);
router.route("/users/logout").post(protect, logout);
router.route("/users/current").post(protect, getCurrentUser);

module.exports = router;