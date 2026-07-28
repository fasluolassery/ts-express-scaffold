import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import requestLogger from './middlewares/logger.middleware';
import errorHandler from './middlewares/error.middleware';
import globalRateLimiter from './middlewares/rate-limiter.middleware';
import { NotFoundError } from './errors';
import router from './routes';
import corsOptions from './config/cors.config';
import { APP_LIMITS, ERROR_MESSAGES } from './constants';

/**
 * Creates and configures the Express Application pipeline.
 */
export const createApp = (): Express => {
  const app = express();

  // Trust first proxy for accurate client IP resolution behind load balancers/reverse proxies
  app.set('trust proxy', APP_LIMITS.TRUST_PROXY);

  // Security HTTP headers
  app.use(helmet());

  // Centralized Request Logger
  app.use(requestLogger);

  // Global Rate Limiting
  app.use(globalRateLimiter);

  // Enable CORS
  app.use(cors(corsOptions));

  // Body parsers
  app.use(express.json({ limit: APP_LIMITS.BODY_PARSER_JSON_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: APP_LIMITS.BODY_PARSER_URLENCODED_LIMIT }));
  app.use(cookieParser());

  // Response compression
  app.use(compression());

  // Mount Centralized Router
  app.use(router);

  // Handle 404 Not Found routes
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError(ERROR_MESSAGES.ROUTE_NOT_FOUND.replace('{url}', req.originalUrl)));
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

export const app = createApp();

export default app;
