import mongoose from 'mongoose';
import config from './index';
import logger from '../utils/logger';
import { SYSTEM_MESSAGES } from '../constants';

export const connectDB = async (): Promise<void> => {
  const { maxRetries, retryDelayMs, uri } = config.db;
  let attempt = 1;
  let delay = retryDelayMs;

  while (attempt <= maxRetries) {
    try {
      const conn = await mongoose.connect(uri);
      logger.info(SYSTEM_MESSAGES.DB_CONNECTED.replace('{host}', conn.connection.host));
      return;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(
        SYSTEM_MESSAGES.DB_CONNECTION_ATTEMPT_FAILED.replace('{attempt}', String(attempt))
          .replace('{max}', String(maxRetries))
          .replace('{error}', errorMessage)
      );

      if (attempt === maxRetries) {
        logger.error(
          SYSTEM_MESSAGES.DB_CONNECTION_ERROR.replace(
            '{error}',
            SYSTEM_MESSAGES.DB_CONNECTION_MAX_RETRIES_EXCEEDED.replace('{max}', String(maxRetries))
          )
        );
        process.exit(1);
      }

      logger.info(
        SYSTEM_MESSAGES.DB_CONNECTION_RETRYING.replace('{seconds}', String(delay / 1000))
      );
      await new Promise((resolve) => setTimeout(resolve, delay));

      attempt++;
      delay *= 2; // Exponential backoff
    }
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn(SYSTEM_MESSAGES.DB_DISCONNECTED);
});

mongoose.connection.on('error', (err) => {
  logger.error(SYSTEM_MESSAGES.DB_ERROR.replace('{error}', err.message));
});

export const closeDB = async (): Promise<void> => {
  await mongoose.connection.close();
  logger.info(SYSTEM_MESSAGES.DB_CLOSED);
};

export default connectDB;
