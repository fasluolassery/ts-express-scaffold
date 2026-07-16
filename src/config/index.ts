import dotenv from 'dotenv';
import { envSchema } from '../validators';

// Load env variables
dotenv.config();

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
  }

  const data = result.data;
  return {
    server: {
      port: data.PORT,
      env: data.NODE_ENV,
      shutdownTimeoutMs: data.SHUTDOWN_TIMEOUT_MS,
    },
    db: {
      uri: data.MONGO_URI,
      maxRetries: data.DB_MAX_RETRIES,
      retryDelayMs: data.DB_RETRY_DELAY_MS,
    },
    jwt: {
      secret: data.JWT_SECRET,
      expiresIn: data.JWT_EXPIRES_IN,
    },
    cors: {
      origins: data.CORS_ORIGIN.split(',').map((o) => o.trim()),
    },
  };
};

export const config = parseEnv();
export default config;
