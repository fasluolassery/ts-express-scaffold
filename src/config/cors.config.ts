import { CorsOptions } from 'cors';
import config from './index';
import { ForbiddenError } from '../errors';
import { ERROR_MESSAGES, CORS_DEFAULTS } from '../constants';

/**
 * Normalizes an origin URL string by trimming whitespace and removing trailing slash(es).
 */
export const normalizeOrigin = (origin: string): string => {
  return origin.trim().replace(/\/+$/, '');
};

/**
 * Custom CORS origin validator callback.
 * - Allows requests with no origin (cURL, Postman, mobile apps, server-to-server).
 * - Strips any trailing slashes from origins for robust comparison.
 * - Allows origins matching wildcard '*' or explicit whitelist in config.cors.origins.
 * - Rejects unauthorized origins with a 403 ForbiddenError.
 */
const validateOrigin = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean | string) => void
): void => {
  // Allow non-browser requests without origin header (e.g. mobile apps, curl, Postman)
  if (!origin) {
    return callback(null, true);
  }

  const normalizedOrigin = normalizeOrigin(origin);
  const allowedOrigins = config.cors.origins;

  // In development, wildcard '*' safely reflects the incoming request origin for credentials support
  if (allowedOrigins.includes('*')) {
    return callback(null, true);
  }

  if (allowedOrigins.includes(normalizedOrigin)) {
    return callback(null, true);
  }

  callback(new ForbiddenError(ERROR_MESSAGES.CORS_ORIGIN_NOT_ALLOWED));
};

/**
 * Application CORS Configuration options.
 */
export const corsOptions: CorsOptions = {
  origin: validateOrigin,
  methods: [...CORS_DEFAULTS.ALLOWED_METHODS],
  allowedHeaders: [...CORS_DEFAULTS.ALLOWED_HEADERS],
  credentials: true,
  optionsSuccessStatus: 204,
  maxAge: CORS_DEFAULTS.PREFLIGHT_MAX_AGE_SECONDS,
};

export default corsOptions;
