const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("./badRequest");
const UnauthenticatedRequestError = require("./unautheticated");
const NotFoundRequestError = require("./notFound");

module.exports = {
  BadRequestError,
  UnauthenticatedRequestError,
  NotFoundRequestError,
};
