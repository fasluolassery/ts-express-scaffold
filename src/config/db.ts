import mongoose, { ConnectOptions } from 'mongoose';
import config from './index';
import logger from '../utils/logger';
import { SYSTEM_MESSAGES } from '../constants';

let isListenerAttached = false;

/**
 * Attach global Mongoose connection event listeners once.
 */
const setupConnectionListeners = (): void => {
  if (isListenerAttached) return;

  mongoose.connection.on('disconnected', () => {
    logger.warn(SYSTEM_MESSAGES.DB_DISCONNECTED);
  });

  mongoose.connection.on('error', (err: Error) => {
    logger.error(SYSTEM_MESSAGES.DB_ERROR.replace('{error}', err.message));
  });

  isListenerAttached = true;
};

/**
 * Connect to MongoDB with exponential backoff retry mechanism.
 */
export const connectDB = async (): Promise<void> => {
  const { maxRetries, retryDelayMs, uri, poolSize, connectTimeoutMs, socketTimeoutMs } = config.db;
  let attempt = 1;
  let delay = retryDelayMs;

  const mongooseOptions: ConnectOptions = {
    maxPoolSize: poolSize,
    connectTimeoutMS: connectTimeoutMs,
    socketTimeoutMS: socketTimeoutMs,
  };

  setupConnectionListeners();

  while (attempt <= maxRetries) {
    try {
      const conn = await mongoose.connect(uri, mongooseOptions);
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
        const failureMsg = SYSTEM_MESSAGES.DB_CONNECTION_MAX_RETRIES_EXCEEDED.replace(
          '{max}',
          String(maxRetries)
        );
        logger.error(SYSTEM_MESSAGES.DB_CONNECTION_ERROR.replace('{error}', failureMsg));
        throw new Error(failureMsg);
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

/**
 * Close MongoDB connection gracefully.
 */
export const closeDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    logger.info(SYSTEM_MESSAGES.DB_CLOSED);
  }
};

export default connectDB;
