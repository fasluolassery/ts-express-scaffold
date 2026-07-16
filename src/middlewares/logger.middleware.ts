import morgan from 'morgan';
import logger from '../utils/logger';
import { LOG_FORMATS } from '../constants';
import config from '../config';

const stream = {
  write: (message: string) => logger.http(message.trim()),
};

const skip = () => {
  return !config.logging.logHttpRequests;
};

export const requestLogger = morgan(LOG_FORMATS.MORGAN_FORMAT, { stream, skip });

export default requestLogger;
