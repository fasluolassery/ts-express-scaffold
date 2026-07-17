import dotenv from 'dotenv';
import path from 'path';
import { envSchema } from '../validators';

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
  }

  const data = result.data;
  const port = data.PORT;
  const serverUrl = data.SERVER_URL || `http://localhost:${port}`;

  return {
    server: {
      port,
      env: data.NODE_ENV,
      url: serverUrl,
      shutdownTimeoutMs: data.SHUTDOWN_TIMEOUT_MS,
    },
    db: {
      uri: data.MONGO_URI,
      maxRetries: data.DB_MAX_RETRIES,
      retryDelayMs: data.DB_RETRY_DELAY_MS,
      poolSize: data.DB_POOL_SIZE,
      connectTimeoutMs: data.DB_CONNECT_TIMEOUT_MS,
      socketTimeoutMs: data.DB_SOCKET_TIMEOUT_MS,
    },
    jwt: {
      secret: data.JWT_SECRET,
      access: {
        secret: data.JWT_ACCESS_SECRET || data.JWT_SECRET,
        expiresIn: data.JWT_ACCESS_EXPIRES_IN,
      },
      refresh: {
        secret: data.JWT_REFRESH_SECRET || `${data.JWT_SECRET}_refresh`,
        expiresIn: data.JWT_REFRESH_EXPIRES_IN,
      },
    },
    cors: {
      origins: data.CORS_ORIGIN.split(',').map((o) => o.trim()),
    },
    logging: {
      level: data.LOG_LEVEL,
      logHttpRequests: data.LOG_HTTP_REQUESTS,
    },
    rateLimit: {
      windowMs: data.RATE_LIMIT_WINDOW_MS,
      max: data.RATE_LIMIT_MAX,
    },
    cookie: {
      secure:
        data.COOKIE_SECURE !== undefined ? data.COOKIE_SECURE : data.NODE_ENV === 'production',
      sameSite: data.COOKIE_SAME_SITE,
      domain: data.COOKIE_DOMAIN,
    },
  };
};

export const config = parseEnv();
export default config;
