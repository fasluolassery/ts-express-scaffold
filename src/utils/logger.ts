import winston from 'winston';
import { LOG_LEVELS, LOG_COLORS, LOG_FORMATS } from '../constants';
import config from '../config';

const level = () => {
  const env = config.server.env;
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

winston.addColors(LOG_COLORS);

const format = winston.format.combine(
  winston.format.timestamp({ format: LOG_FORMATS.TIMESTAMP }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `[${info.timestamp}] [${info.level}]: ${info.message}`)
);

const transports = [
  new winston.transports.Console({
    format,
  }),
];

export const logger = winston.createLogger({
  level: level(),
  levels: LOG_LEVELS,
  transports,
});

export default logger;
