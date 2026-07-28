import dotenv from 'dotenv';
import path from 'path';
import { envSchema, EnvSchemaType } from '../validators';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Modular Configuration Section Builders
 */
const buildServerConfig = (env: EnvSchemaType) => ({
  port: env.PORT,
  env: env.NODE_ENV,
  url: env.SERVER_URL || `http://localhost:${env.PORT}`,
  shutdownTimeoutMs: env.SHUTDOWN_TIMEOUT_MS,
});

const buildDatabaseConfig = (env: EnvSchemaType) => ({
  uri: env.MONGO_URI,
  maxRetries: env.DB_MAX_RETRIES,
  retryDelayMs: env.DB_RETRY_DELAY_MS,
  poolSize: env.DB_POOL_SIZE,
  connectTimeoutMs: env.DB_CONNECT_TIMEOUT_MS,
  socketTimeoutMs: env.DB_SOCKET_TIMEOUT_MS,
});

const buildJwtConfig = (env: EnvSchemaType) => ({
  secret: env.JWT_SECRET,
  access: {
    secret: env.JWT_ACCESS_SECRET || env.JWT_SECRET,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  },
  refresh: {
    secret: env.JWT_REFRESH_SECRET || `${env.JWT_SECRET}_refresh`,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
});

const buildCorsConfig = (env: EnvSchemaType) => ({
  origins: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
});

const buildLoggingConfig = (env: EnvSchemaType) => ({
  level: env.LOG_LEVEL,
  logHttpRequests: env.LOG_HTTP_REQUESTS,
});

const buildRateLimitConfig = (env: EnvSchemaType) => ({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
});

const buildCookieConfig = (env: EnvSchemaType) => ({
  secure: env.COOKIE_SECURE !== undefined ? env.COOKIE_SECURE : env.NODE_ENV === 'production',
  sameSite: env.COOKIE_SAME_SITE,
  domain: env.COOKIE_DOMAIN,
});

/**
 * Validates process environment variables against Zod schema and builds immutable AppConfig object.
 */
const loadConfiguration = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formattedErrors = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    console.error('❌ Environment Variable Validation Failed:\n' + formattedErrors);
    process.exit(1);
  }

  const env = result.data;

  return Object.freeze({
    server: buildServerConfig(env),
    db: buildDatabaseConfig(env),
    jwt: buildJwtConfig(env),
    cors: buildCorsConfig(env),
    logging: buildLoggingConfig(env),
    rateLimit: buildRateLimitConfig(env),
    cookie: buildCookieConfig(env),
  });
};

export type AppConfig = ReturnType<typeof loadConfiguration>;
export const config: AppConfig = loadConfiguration();
export default config;
