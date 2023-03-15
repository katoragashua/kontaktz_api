const { StatusCodes } = require("http-status-codes");
const CustomError = require("./customError");

class NotFoundRequestError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundRequestError;
