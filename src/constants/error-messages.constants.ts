export const ERROR_MESSAGES = {
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  CONFLICT: 'Conflict',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',

  // Specific validation, auth, and mapping messages
  VALIDATION_FAILED: 'Validation failed',
  INVALID_TOKEN: 'Invalid token. Please log in again.',
  TOKEN_EXPIRED: 'Your token has expired. Please log in again.',
  ROUTE_NOT_FOUND: "Can't find {url} on this server!",
  CAST_ERROR: 'Resource not found with id of {id}',
  DUPLICATE_KEY: 'Duplicate field value entered: {keys}',
  CORS_ORIGIN_NOT_ALLOWED: 'Origin not allowed by CORS',
  SYSTEM_UNHEALTHY: 'System is unhealthy',
  DATABASE_UNREACHABLE: 'Database is unreachable',
} as const;
