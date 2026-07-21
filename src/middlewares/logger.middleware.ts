import morgan from 'morgan';
import logger from '../utils/logger';
import { LOG_FORMATS } from '../constants';
import config from '../config';

/**
 * Maps HTTP status code to appropriate Winston log level.
 */
const getLogLevel = (status: number): 'error' | 'warn' | 'http' => {
  if (status >= 500) return 'error';
  if (status >= 400) return 'warn';
  return 'http';
};

/**
 * Clean Morgan HTTP request logging handler.
 * Format: METHOD URL STATUS CONTENT-LENGTH - RESPONSE-TIME ms
 * Dynamic Levels:
 * - 1xx/2xx/3xx -> [http]
 * - 4xx -> [warn]
 * - 5xx -> [error]
 */
export const requestLogger = morgan(LOG_FORMATS.MORGAN_FORMAT, {
  skip: () => !config.logging.logHttpRequests,
  stream: {
    write: (message: string) => {
      const trimmed = message.trim();
      const statusMatch = trimmed.match(/^[A-Z]+\s+\S+\s+(\d{3})/);
      const statusStr = statusMatch?.[1];
      const status = statusStr ? parseInt(statusStr, 10) : 200;
      const level = getLogLevel(status);

      logger.log(level, trimmed);
    },
  },
});

export default requestLogger;
