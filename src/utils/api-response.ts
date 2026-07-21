import { Response } from 'express';
import logger from './logger';
import config from '../config';
import { SUCCESS_MESSAGES } from '../constants';

export interface ApiResponseOptions<T> {
  res: Response;
  statusCode: number;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponseOptions {
  res: Response;
  statusCode: number;
  message: string;
  errors?: Record<string, string>;
  stack?: string;
}

/**
 * Standard Success Response Format
 */
export const sendSuccess = <T>({
  res,
  statusCode,
  message = SUCCESS_MESSAGES.DEFAULT,
  data,
  meta,
}: ApiResponseOptions<T>): void => {
  if (config.server.env === 'development' && message) {
    logger.info(`Success: ${message}`);
  }

  res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
  });
};

/**
 * Standard Error Response Format
 */
export const sendError = ({
  res,
  statusCode,
  message,
  errors,
  stack,
}: ApiErrorResponseOptions): void => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors !== undefined && { errors }),
    ...(stack !== undefined && { stack }),
  });
};
