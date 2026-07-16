import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import logger from '../utils/logger';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';
import config from '../config';
import { sendError } from '../utils/api-response';

export const errorHandler: ErrorRequestHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;
  error.statusCode = err.statusCode;
  error.isOperational = err.isOperational;
  error.errors = err.errors;

  // Log error using Winston
  logger.error(`${err.name || 'Error'}: ${err.message}`, {
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
  });

  // Handle Zod Schema Validation Error
  if (err instanceof ZodError) {
    const validationErrors: Record<string, string> = {};
    err.issues.forEach((issue) => {
      const path = issue.path.join('.');
      validationErrors[path] = issue.message;
    });
    error = new BadRequestError(ERROR_MESSAGES.VALIDATION_FAILED);
    (error as BadRequestError & { errors?: Record<string, string> }).errors = validationErrors;
  }

  // Handle Mongoose Bad ObjectID (CastError)
  if (err.name === 'CastError') {
    const message = ERROR_MESSAGES.CAST_ERROR.replace('{id}', err.value);
    error = new NotFoundError(message);
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = ERROR_MESSAGES.DUPLICATE_KEY.replace(
      '{keys}',
      Object.keys(err.keyValue).join(', ')
    );
    error = new BadRequestError(message);
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => (val as { message: string }).message)
      .join(', ');
    error = new BadRequestError(message);
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new UnauthorizedError(ERROR_MESSAGES.INVALID_TOKEN);
  }

  if (err.name === 'TokenExpiredError') {
    error = new UnauthorizedError(ERROR_MESSAGES.TOKEN_EXPIRED);
  }

  // Send Response
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  let responseMessage = error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

  // Mask non-operational/internal errors in production
  const isOperational = error.isOperational === true;
  if (config.server.env === 'production' && !isOperational) {
    responseMessage = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  }

  sendError({
    res,
    statusCode,
    message: responseMessage,
    ...(error.errors && { errors: error.errors }),
    ...(config.server.env === 'development' && { stack: error.stack }),
  });
};

export default errorHandler;
