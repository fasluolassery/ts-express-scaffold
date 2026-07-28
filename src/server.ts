import { Server } from 'http';
import app from './app';
import config from './config';
import { connectDB, closeDB } from './config/db';
import logger from './utils/logger';
import { SYSTEM_MESSAGES } from './constants';

let server: Server | undefined;
let isShuttingDown = false;

/**
 * Initiates graceful shutdown of HTTP server and database connections.
 */
const gracefulShutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`${SYSTEM_MESSAGES.GRACEFUL_SHUTDOWN} (${signal})`);

  // Force exit after configured timeout if graceful shutdown hangs
  const forceExitTimeout = setTimeout(() => {
    logger.error(SYSTEM_MESSAGES.GRACEFUL_SHUTDOWN_TIMEOUT);
    process.exit(1);
  }, config.server.shutdownTimeoutMs);

  try {
    if (server) {
      await new Promise<void>((resolve) => {
        server?.close(() => {
          logger.info(SYSTEM_MESSAGES.HTTP_SERVER_CLOSED);
          resolve();
        });
      });
    }

    await closeDB();
    clearTimeout(forceExitTimeout);
    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(SYSTEM_MESSAGES.GRACEFUL_SHUTDOWN_ERROR.replace('{error}', errorMessage));
    clearTimeout(forceExitTimeout);
    process.exit(1);
  }
};

/**
 * Register global process error and termination signal listeners.
 */
const setupProcessListeners = (): void => {
  process.on('uncaughtException', (err: Error) => {
    logger.error(SYSTEM_MESSAGES.UNCAUGHT_EXCEPTION);
    logger.error(`${err.name}: ${err.message}`, { stack: err.stack });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error(SYSTEM_MESSAGES.UNHANDLED_REJECTION);
    const err = reason instanceof Error ? reason : new Error(String(reason));
    logger.error(`${err.name}: ${err.message}`, { stack: err.stack });
    gracefulShutdown('unhandledRejection');
  });

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

/**
 * Boots the HTTP server and establishes database connection.
 */
const startServer = async (): Promise<void> => {
  setupProcessListeners();

  try {
    await connectDB();

    const port = config.server.port;
    server = app.listen(port, () => {
      logger.info(
        SYSTEM_MESSAGES.SERVER_START.replace('{env}', config.server.env).replace(
          '{port}',
          String(port)
        )
      );
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error(SYSTEM_MESSAGES.SERVER_START_FAILED_DB, { error: errorMessage });
    process.exit(1);
  }
};

startServer();
