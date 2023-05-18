const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("./badRequest");
const UnauthenticatedRequestError = require("./unautheticated");
const NotFoundError = require("./notFound");

module.exports = {
  BadRequestError,
  UnauthenticatedRequestError,
  NotFoundError,
};
