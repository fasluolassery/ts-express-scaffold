import morgan, { StreamOptions } from 'morgan';
import logger from '../utils/logger';
import { LOG_FORMATS } from '../constants';
import config from '../config';

/**
 * Maps HTTP status code to appropriate Winston log level.
 * - 1xx / 2xx / 3xx -> 'http'
 * - 4xx             -> 'warn'
 * - 5xx             -> 'error'
 */
const getLogLevel = (status: number): 'error' | 'warn' | 'http' => {
  if (status >= 500) return 'error';
  if (status >= 400) return 'warn';
  return 'http';
};

/**
 * Extract HTTP status code from formatted Morgan log string.
 */
const extractHttpStatus = (message: string): number => {
  const statusMatch = message.match(/\s+(\d{3})\s+/);
  if (statusMatch && statusMatch[1]) {
    const parsed = parseInt(statusMatch[1], 10);
    if (!isNaN(parsed)) return parsed;
  }
  return 200;
};

/**
 * Morgan write stream interface piping formatted HTTP logs into Winston logger.
 */
const streamOptions: StreamOptions = {
  write: (message: string) => {
    const trimmed = message.trim();
    const status = extractHttpStatus(trimmed);
    const level = getLogLevel(status);

    logger.log(level, trimmed);
  },
};

/**
 * HTTP request logging middleware powered by Morgan and Winston.
 */
export const requestLogger = morgan(LOG_FORMATS.MORGAN_FORMAT, {
  skip: () => config.server.env === 'test' || !config.logging.logHttpRequests,
  stream: streamOptions,
});

export default requestLogger;
