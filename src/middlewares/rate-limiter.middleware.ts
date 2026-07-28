import rateLimit, { Options } from 'express-rate-limit';
import config from '../config';
import { ERROR_MESSAGES } from '../constants';

/**
 * Factory helper to create custom rate limiters for specific routes.
 */
export const createRateLimiter = (options?: Partial<Options>) => {
  return rateLimit({
    windowMs: options?.windowMs || config.rateLimit.windowMs,
    limit: options?.limit || config.rateLimit.max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: () => config.server.env === 'development' || config.server.env === 'test',
    message: {
      success: false,
      message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
    },
    ...options,
  });
};

/**
 * Global API rate limiter middleware to prevent brute-force and DDoS abuse.
 */
export const globalRateLimiter = createRateLimiter();

export default globalRateLimiter;
