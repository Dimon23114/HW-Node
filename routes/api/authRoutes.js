const express = require("express");

const router = express.Router();

const { signup, login, logout } = require("../controllers/authController");
const { checkSignupData, protect } = require("../middlewares/authMiddlewares");

router.route("/signup").post(checkSignupData, signup);
router.route("/login").post(login);
router.route("/logout").post(protect, logout);

module.exports = router;