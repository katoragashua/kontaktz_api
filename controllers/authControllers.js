const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedRequestError,
  NotFoundError,
} = require("../errors/index");

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const utilFuncs = require("../utils/index");
const CustomError = require("../errors/customError");

const createJWT = async (user) => {
  return jwt.sign(
    { userId: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

const signupUser = async (req, res) => {
  const { email, password, name } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new CustomError.BadRequestError(
      "User already exists with this email."
    );
  }
  // Create verification token
  const verificationToken = crypto.randomBytes(40).toString("hex");

  // Create a user account
  const user = await User.create({ name, email, password, verificationToken });
  const origin = "http://localhost:5000";
  await utilFuncs.sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });
  res.status(StatusCodes.CREATED).json({
    message:
      "Please verify your account. A verification email has been sent to your email address.",
    user,
  });
};

const verifyUser = async (req, res) => {
  const { email, token } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  if (!(user.verificationToken === token)) {
    throw new CustomError.UnauthenticatedRequestError("Verification failed.");
  }
  user.isVerified = true;
  user.verified = new Date(Date.now());
  user.verificationToken = null;
  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ message: "Account verified successfully." });
};

const signinUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please enter email/password.");
  }
  const user = await User.findOne({ email: email });
  // Check if user exists
  if (!user) {
    throw new UnauthenticatedRequestError("Invalid credentials.");
  }
  // Check if user is verified
  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError("Please verify your account");
  }
  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    throw new UnauthenticatedRequestError("Password is incorrect.");
  }
  const token = crypto.randomBytes(40).toString("hex");
  const tokenUser = utilFuncs.createUserObj({
    name: user.name,
    email: user.email,
    userId: user._id
  })
  let refreshToken = "";

  if (refreshToken) {
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  res.status(StatusCodes.OK).json({ user, token });
};

module.exports = {
  signupUser,
  signinUser,
};
