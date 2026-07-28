import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import logger from '../utils/logger';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';
import config from '../config';
import { sendError, normalizeError, ErrorWithDetails } from '../utils';

/**
 * Global Express Error Handling Middleware.
 */
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const error = normalizeError(err);
  const rawError = (err && typeof err === 'object' ? err : {}) as ErrorWithDetails;

  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const isOperational = error.isOperational === true;

  // Log non-operational/5xx errors as logger.error, and operational 4xx as logger.warn in dev
  if (!isOperational || statusCode >= 500) {
    logger.error(`${rawError.name || 'Error'}: ${error.message}`, {
      method: req.method,
      url: req.originalUrl,
      stack: rawError.stack || error.stack,
    });
  } else if (config.server.env === 'development') {
    logger.warn(`${rawError.name || 'Error'}: ${error.message}`);
  }

  // Mask non-operational/internal errors in production
  let responseMessage = error.message;
  if (config.server.env === 'production' && !isOperational) {
    responseMessage = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  }

  sendError({
    res,
    statusCode,
    message: responseMessage,
    ...(error.errors && { errors: error.errors }),
    ...(config.server.env === 'development' && { stack: rawError.stack || error.stack }),
  });
};

export default errorHandler;
