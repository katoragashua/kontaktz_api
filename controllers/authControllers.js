const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors/index");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Token = require("../models/Token");
const crypto = require("crypto");
const utilFuncs = require("../utils/index");

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
    throw new BadRequestError("User already exists with this email.");
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

const verifyEmail = async (req, res) => {
  const { email, token } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User not found");
  }
  // Check if user is already verified
  if (user.isVerified) {
    return res
      .status(StatusCodes.OK)
      .json({ message: "User already verified." });
  }

  if (!(user.verificationToken === token)) {
    throw new UnauthenticatedRequestError("Verification failed.");
  }
  user.isVerified = true;
  user.verified = new Date(Date.now());
  user.verificationToken = "";
  await user.save();
  console.log(user);
  res
    .status(StatusCodes.OK)
    .json({ message: "Account verified successfully.", user });
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
    throw new UnauthenticatedRequestError("Please verify your account");
  }
  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    throw new UnauthenticatedRequestError("Password is incorrect.");
  }
  const tokenUser = utilFuncs.createUserObj(user);
  let refreshToken = "";
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnauthenticatedRequestError("Cannot access route.");
    }
    refreshToken = existingToken.refreshToken;
    await utilFuncs.attachCookies(res, tokenUser, refreshToken);
    return res
      .status(StatusCodes.OK)
      .json({ message: "User logged in successfully", user });
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  await Token.create({ refreshToken, user: user._id });
  await utilFuncs.attachCookies(res, tokenUser, refreshToken);
  return res
    .status(StatusCodes.OK)
    .json({ message: "User logged in successfully", user });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) throw new BadRequestError("Please enter a valid email address.");
  const user = await User.findOne({ email });
  const origin = "http://localhost:5000";
  if (user) {
    const passwordToken = crypto.randomBytes(40).toString("hex");
    await utilFuncs.sendResetEmail({
      name: user.name,
      email: user.email,
      passwordToken,
      origin,
    });

    user.passwordToken = passwordToken;
    user.passwordTokenExpiration = new Date(Date.now() + 1000 * 60 * 60);
    await user.save();
  }

  res.status(StatusCodes.OK).json({
    message:
      "Success: A password reset link has been sent to your email address.",
  });
};

const resetPassword = async (req, res) => {
  const { email, password, token } = req.body;
  if (!email || !password || !token) {
    throw new BadRequestError("Missing credentials");
  }

  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date(Date.now());
    if (
      !(user.passwordToken === token) ||
      currentDate > user.passwordTokenExpiration
    ) {
      throw new UnauthenticatedRequestError("Invalid token or expired.");
    }
    user.password = password;
    user.passwordToken = null;
    user.passwordTokenExpiration = null;
    await user.save();
  }
  res
    .status(StatusCodes.OK)
    .json({ message: "Password updated successfully.", user });
};

module.exports = {
  signupUser,
  signinUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
