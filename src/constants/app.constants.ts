export const APP_LIMITS = {
  BODY_PARSER_JSON_LIMIT: '10kb',
  BODY_PARSER_URLENCODED_LIMIT: '10kb',
  TRUST_PROXY: 1,
} as const;

export const TIME_MS = {
  FIFTEEN_MINUTES: 15 * 60 * 1000,
  SEVEN_DAYS: 7 * 24 * 60 * 60 * 1000,
} as const;

export const TIME_SECONDS = {
  ONE_DAY: 86400,
} as const;

export const COOKIE_MAX_AGE_MS = {
  ACCESS_TOKEN: TIME_MS.FIFTEEN_MINUTES,
  REFRESH_TOKEN: TIME_MS.SEVEN_DAYS,
} as const;

export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

export const CORS_DEFAULTS = {
  PREFLIGHT_MAX_AGE_SECONDS: TIME_SECONDS.ONE_DAY,
  ALLOWED_METHODS: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'] as const,
  ALLOWED_HEADERS: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ] as const,
} as const;

export const APP_ROUTES = {
  API_PREFIX: '/api',
  AUTH_PREFIX: '/auth',
  SWAGGER_DOCS: '/api-docs',
  HEALTH: '/health',
} as const;
