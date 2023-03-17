const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/userController");
const User = require("../models/User")
router.post("/create", createUser)

module.exports = router