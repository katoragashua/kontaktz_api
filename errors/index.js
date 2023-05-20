const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("./badRequest");
const UnauthenticatedRequestError = require("./unautheticated");
const NotFoundError = require("./notFound");
const UnauthorizedError = require("./unauthorizedError");
const UnsupportedFormatError = require("./unsupportedError");

module.exports = {
  BadRequestError,
  UnauthenticatedRequestError,
  NotFoundError,
  UnauthorizedError,
  UnsupportedFormatError,
};
