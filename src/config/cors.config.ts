import { CorsOptions } from 'cors';
import config from './index';
import { ForbiddenError } from '../errors';
import { ERROR_MESSAGES } from '../constants';

const validateOrigin = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
): void => {
  // Allow requests with no origin (like curl, mobile apps, or server-to-server)
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

export const corsOptions: CorsOptions = {
  origin: validateOrigin,
  credentials: true,
};

export default corsOptions;
