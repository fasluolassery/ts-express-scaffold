import { Response } from 'express';
import logger from './logger';
import config from '../config';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../constants';

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
}

export interface ApiPaginatedResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiErrorResponseOptions {
  res: Response;
  statusCode?: number;
  message: string;
  errors?: Record<string, string>;
  stack?: string;
}

export interface ApiResponsePayload<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
}

export interface ApiErrorResponsePayload {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  stack?: string;
}

/**
 * Standard Success Response Format
 */
export const sendSuccess = <T>({
  res,
  statusCode = HTTP_STATUS.OK,
  message = SUCCESS_MESSAGES.DEFAULT,
  data,
}: ApiResponseOptions<T>): void => {
  if (config.server.env === 'development' && message) {
    logger.info(`Success: ${message}`);
  }

  const payload: ApiResponsePayload<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };

  res.status(statusCode).json(payload);
};

/**
 * Standard Paginated List Response Format
 */
export const sendPaginated = <T>({
  res,
  statusCode = HTTP_STATUS.OK,
  message = SUCCESS_MESSAGES.DEFAULT,
  data,
  pagination,
}: ApiPaginatedResponseOptions<T>): void => {
  const payload: ApiResponsePayload<T[]> = {
    success: true,
    message,
    data,
    pagination,
  };

  res.status(statusCode).json(payload);
};

/**
 * Standard Error Response Format
 */
export const sendError = ({
  res,
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  message,
  errors,
  stack,
}: ApiErrorResponseOptions): void => {
  const payload: ApiErrorResponsePayload = {
    success: false,
    message,
    ...(errors !== undefined && { errors }),
    ...(stack !== undefined && { stack }),
  };

  res.status(statusCode).json(payload);
};

export default { sendSuccess, sendPaginated, sendError };
