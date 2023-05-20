const express = require("express");
const router = express.Router();
const {
  signupUser,
  signinUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authControllers");

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
