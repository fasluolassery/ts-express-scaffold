export const APP_LIMITS = {
  BODY_PARSER_JSON_LIMIT: '10kb',
  BODY_PARSER_URLENCODED_LIMIT: '10kb',
} as const;

export const APP_ROUTES = {
  API_PREFIX: '/api',
  SWAGGER_DOCS: '/api-docs',
  HEALTH: '/health',
  AUTH: {
    REGISTER: '/auth/register',
  },
} as const;
