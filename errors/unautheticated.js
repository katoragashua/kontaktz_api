const { StatusCodes } = require("http-status-codes");
const CustomError = require("./customError");

class UnauthenticatedRequestError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedRequestError;
