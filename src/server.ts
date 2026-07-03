import { Server } from 'http';
import app from './app';
import config from './config';
import { connectDB, closeDB } from './config/db';
import logger from './utils/logger';
import { SYSTEM_MESSAGES } from './constants';

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(SYSTEM_MESSAGES.UNCAUGHT_EXCEPTION);
  logger.error(`${err.name}: ${err.message}`);
  if (err.stack) logger.error(err.stack);
  process.exit(1);
});

let server: Server | undefined;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Start HTTP Server
  const port = config.server.port;
  server = app.listen(port, () => {
    logger.info(
      SYSTEM_MESSAGES.SERVER_START.replace('{env}', config.server.env).replace(
        '{port}',
        String(port)
      )
    );
  });
};

startServer();

// Handle unhandled promise rejections
// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.on('unhandledRejection', (err: any) => {
  logger.error(SYSTEM_MESSAGES.UNHANDLED_REJECTION);
  logger.error(`${err?.name || 'Error'}: ${err?.message || err}`);
  if (err?.stack) logger.error(err.stack);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle graceful shutdown signals
const gracefulShutdown = () => {
  logger.info(SYSTEM_MESSAGES.GRACEFUL_SHUTDOWN);

  // Force exit after configured timeout if graceful shutdown hangs
  const forceExitTimeout = setTimeout(() => {
    logger.error(SYSTEM_MESSAGES.GRACEFUL_SHUTDOWN_TIMEOUT);
    process.exit(1);
  }, config.server.shutdownTimeoutMs);

  if (server) {
    server.close(async () => {
      logger.info(SYSTEM_MESSAGES.HTTP_SERVER_CLOSED);
      await closeDB();
      clearTimeout(forceExitTimeout);
      process.exit(0);
    });
  } else {
    clearTimeout(forceExitTimeout);
    process.exit(0);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
