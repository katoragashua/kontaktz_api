const express = require("express");
const router = express.Router();
const { signupUser, signinUser } = require("../controllers/userController");
const User = require("../models/User")
router.post("/signup", signupUser)
router.post("/signin", signinUser)

module.exports = router