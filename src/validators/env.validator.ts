import { z } from 'zod';
import { VALIDATION_MESSAGES } from '../constants';

/**
 * Reusable transformer for string-to-boolean environment variables.
 */
const zBoolean = (defaultValue?: boolean) => {
  const schema = z.preprocess(
    (val) => (typeof val === 'string' ? val.toLowerCase() === 'true' : Boolean(val)),
    z.boolean()
  );
  return defaultValue !== undefined ? schema.default(defaultValue) : schema.optional();
};

/**
 * Environment variable validation schema using Zod.
 */
export const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database Configuration
  MONGO_URI: z
    .string({ message: VALIDATION_MESSAGES.MONGO_URI_REQUIRED })
    .min(1, VALIDATION_MESSAGES.MONGO_URI_REQUIRED),
  DB_MAX_RETRIES: z.coerce.number().default(5),
  DB_RETRY_DELAY_MS: z.coerce.number().default(2000),
  DB_POOL_SIZE: z.coerce.number().default(10),
  DB_CONNECT_TIMEOUT_MS: z.coerce.number().default(10000),
  DB_SOCKET_TIMEOUT_MS: z.coerce.number().default(45000),

  // JWT Configuration
  JWT_SECRET: z
    .string({ message: VALIDATION_MESSAGES.JWT_SECRET_REQUIRED })
    .min(1, VALIDATION_MESSAGES.JWT_SECRET_REQUIRED),
  JWT_ACCESS_SECRET: z.string().optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Server & Security Configuration
  SERVER_URL: z.string().optional(),
  CORS_ORIGIN: z.string().default('*'),
  SHUTDOWN_TIMEOUT_MS: z.coerce.number().default(10000),

  // Logging Options
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('http'),
  LOG_HTTP_REQUESTS: zBoolean(true),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  // Cookies
  COOKIE_SECURE: zBoolean(),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  COOKIE_DOMAIN: z.string().optional(),
});

export type EnvSchemaType = z.infer<typeof envSchema>;
