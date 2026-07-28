import { ZodError } from 'zod';
import { AppError, BadRequestError, NotFoundError, UnauthorizedError } from '../errors';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

export interface ErrorWithDetails extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: number;
  value?: string;
  keyValue?: Record<string, string>;
  errors?: Record<string, { message: string }>;
}

/**
 * Normalizes third-party framework errors (Zod, Mongoose, JWT) into standardized AppError instances.
 */
export const normalizeError = (err: unknown): AppError => {
  if (err instanceof AppError) {
    return err;
  }

  // Handle Zod Schema Validation Errors
  if (err instanceof ZodError) {
    const validationErrors: Record<string, string> = {};
    err.issues.forEach((issue) => {
      const path = issue.path.join('.');
      validationErrors[path] = issue.message;
    });
    return new BadRequestError(ERROR_MESSAGES.VALIDATION_FAILED, validationErrors);
  }

  const errorObj = (err && typeof err === 'object' ? err : {}) as ErrorWithDetails;

  // Handle Mongoose Bad ObjectID (CastError)
  if (errorObj.name === 'CastError' && errorObj.value) {
    return new NotFoundError(ERROR_MESSAGES.CAST_ERROR.replace('{id}', errorObj.value));
  }

  // Handle Mongoose Duplicate Key Error
  if (errorObj.code === 11000 && errorObj.keyValue) {
    const keys = Object.keys(errorObj.keyValue).join(', ');
    return new BadRequestError(ERROR_MESSAGES.DUPLICATE_KEY.replace('{keys}', keys));
  }

  // Handle Mongoose Validation Errors
  if (errorObj.name === 'ValidationError' && errorObj.errors) {
    const message = Object.values(errorObj.errors)
      .map((val) => val.message)
      .join(', ');
    return new BadRequestError(message);
  }

  // Handle JWT Errors
  if (errorObj.name === 'JsonWebTokenError') {
    return new UnauthorizedError(ERROR_MESSAGES.INVALID_TOKEN);
  }

  if (errorObj.name === 'TokenExpiredError') {
    return new UnauthorizedError(ERROR_MESSAGES.TOKEN_EXPIRED);
  }

  const message = errorObj.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  const statusCode = errorObj.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  return new AppError(message, statusCode, false);
};

export default normalizeError;
