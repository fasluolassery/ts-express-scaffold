export const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
} as const;

export const LOG_COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
} as const;

export const LOG_FORMATS = {
  TIMESTAMP: 'YYYY-MM-DD HH:mm:ss:ms',
  MORGAN_FORMAT: ':method :url :status :res[content-length] - :response-time ms',
} as const;

export const SYSTEM_MESSAGES = {
  UNCAUGHT_EXCEPTION: 'UNCAUGHT EXCEPTION! 💥 Shutting down...',
  UNHANDLED_REJECTION: 'UNHANDLED REJECTION! 💥 Shutting down...',
  GRACEFUL_SHUTDOWN: 'SIGTERM/SIGINT received. Shutting down gracefully...',
  HTTP_SERVER_CLOSED: 'HTTP server closed.',
  SERVER_START: 'Server running in {env} mode on port {port}',
  DB_CONNECTED: 'MongoDB Connected: {host}',
  DB_CONNECTION_ERROR: 'Error connecting to MongoDB: {error}',
  DB_DISCONNECTED: 'MongoDB connection disconnected',
  DB_ERROR: 'MongoDB connection error: {error}',
  DB_CLOSED: 'MongoDB connection closed through app termination',
  DB_CONNECTION_ATTEMPT_FAILED: 'Failed to connect to MongoDB (Attempt {attempt}/{max}): {error}',
  DB_CONNECTION_RETRYING: 'Retrying MongoDB connection in {seconds}s...',
  DB_CONNECTION_MAX_RETRIES_EXCEEDED: 'Max retries ({max}) exceeded.',
  GRACEFUL_SHUTDOWN_TIMEOUT: 'Graceful shutdown timed out, forcing exit.',
} as const;
