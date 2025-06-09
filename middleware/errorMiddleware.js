import { AppError } from "../utils/errorHandler.js";
import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field: '${field}' already exists.`;
    statusCode = 400;
  }

  logger.error(`${req.method} ${req.originalUrl} - ${message}`);

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
