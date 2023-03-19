const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedRequestError,
  NotFoundRequestError,
} = require("../errors/index");

const bcrypt = require("bcryptjs");
const User = require("../models/User");

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
  const user = await User.create({ ...req.body });
  const token = await createJWT(user);
  res.status(StatusCodes.CREATED).json({ user, token });
};

const signinUser = async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) {
    throw new BadRequestError("Please enter email/password.")
  }
  const user = await User.findOne({ email: email });
  if(!user) {
    throw new UnauthenticatedRequestError("Invalid credentials.")
  }
  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    throw new UnauthenticatedRequestError("Password is incorrect.");
  }

  const token = await createJWT(user);

  res.status(StatusCodes.OK).json({user, token});
};

module.exports = {
  signupUser,
  signinUser,
};
