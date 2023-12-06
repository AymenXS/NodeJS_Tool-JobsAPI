const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const util = require('util');

const errorHandlerMiddleware = async (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message);
};

module.exports = errorHandlerMiddleware;
