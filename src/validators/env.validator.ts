import { z } from 'zod';
import { VALIDATION_MESSAGES } from '../constants';

export const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string({
    message: VALIDATION_MESSAGES.MONGO_URI_REQUIRED,
  }),
  JWT_SECRET: z.string({
    message: VALIDATION_MESSAGES.JWT_SECRET_REQUIRED,
  }),
  JWT_EXPIRES_IN: z.string().default('1d'),
  CORS_ORIGIN: z.string().default('*'),
  DB_MAX_RETRIES: z.coerce.number().default(5),
  DB_RETRY_DELAY_MS: z.coerce.number().default(2000),
  SHUTDOWN_TIMEOUT_MS: z.coerce.number().default(10000),
});

export type EnvSchemaType = z.infer<typeof envSchema>;
