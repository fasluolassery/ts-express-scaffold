import { CorsOptions } from 'cors';
import config from './index';
import { ForbiddenError } from '../errors';
import { ERROR_MESSAGES, CORS_DEFAULTS } from '../constants';

/**
 * Custom CORS origin validator callback.
 * - Allows requests with no origin (cURL, Postman, mobile apps, server-to-server).
 * - Allows origins matching wildcard '*' or explicit whitelist in config.cors.origins.
 * - Rejects unauthorized origins with a 403 ForbiddenError.
 */
const validateOrigin = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
): void => {
  if (!origin) {
    return callback(null, true);
  }

  const allowedOrigins = config.cors.origins;

  if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new ForbiddenError(ERROR_MESSAGES.CORS_ORIGIN_NOT_ALLOWED));
  }
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
