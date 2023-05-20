const User = require("../models/User");
const utilFuncs = require("../utils/index");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const Token = require("../models/Token");

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  try {
    if (accessToken) {
      const decoded = await utilFuncs.verifyJWT(
        accessToken,
        process.env.JWT_SECRET
      );
      req.user = decoded;
      console.log(req.user);
      return next();
    }

    if (refreshToken) {
      const decoded = await utilFuncs.verifyJWT(
        refreshToken,
        process.env.JWT_SECRET
      );
      // Check if token exists and is valid
      const token = await Token.findOne({
        user: decoded.user.userId,
        refreshToken: decoded.refreshToken,
      });
      if (!token || !token.isValid)
        throw new UnauthorizedError("Authentication invalid");
      req.user = decoded.user;
      // Attach cookies again
      await utilFuncs.attachCookies(res, req.user, decoded.refreshToken);
      next();
    }
  } catch (error) {
    throw new CustomError.UnauthorizedError("Unauthorized request.");
  }
};

module.exports = { authenticateUser };
