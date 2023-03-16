const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedRequestError,
  NotFoundRequestError,
} = require("../errors/index");

const bcrypt = require("bcryptjs");
const User = require("../models/User");

const signupUser = async (req, res) => {
  console.log(req.body);
  return res.status(StatusCodes.CREATED).json(req.body);
};

module.exports = {
  signupUser,
};
