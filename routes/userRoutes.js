const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateUserProfilePhoto,
} = require("../controllers/userControllers");

const { authenticateUser } = require("../middlewares/authentication");

router.get("/profile", authenticateUser, getUserProfile);
router.patch("/update-profile", authenticateUser, updateUserProfile);
router.patch("/update-profile-photo", authenticateUser, updateUserProfilePhoto);

module.exports = router;
