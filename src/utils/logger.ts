import winston from 'winston';
import { LOG_LEVELS, LOG_COLORS, LOG_FORMATS } from '../constants';
import config from '../config';

const getLogLevel = (): string => {
  return config.logging.level || (config.server.env === 'development' ? 'debug' : 'info');
};

winston.addColors(LOG_COLORS);

/**
 * Human-readable colorized log format for development environment.
 */
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: LOG_FORMATS.TIMESTAMP }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `[${info.timestamp}] [${info.level}]: ${info.message}`)
);

/**
 * Structured JSON log format for production cloud log aggregators.
 */
const prodFormat = winston.format.combine(
  winston.format.timestamp({ format: LOG_FORMATS.TIMESTAMP }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const isTestEnv = config.server.env === 'test';
const isDevEnv = config.server.env === 'development';

const transports = [
  new winston.transports.Console({
    format: isDevEnv ? devFormat : prodFormat,
    silent: isTestEnv,
  }),
];

/**
 * Centralized Winston Logger instance.
 */
export const logger = winston.createLogger({
  level: getLogLevel(),
  levels: LOG_LEVELS,
  transports,
});

export default logger;
