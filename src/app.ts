import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import config from './config';
import requestLogger from './middlewares/logger.middleware';
import errorHandler from './middlewares/error.middleware';
import { NotFoundError } from './errors';
import router from './routes';
import corsOptions from './config/cors.config';
import { APP_LIMITS, ERROR_MESSAGES } from './constants';

const app = express();

// Security HTTP headers
app.use(helmet());

// Centralized Request Logger & Correlation ID Tracking
app.use(requestLogger);

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  limit: config.rateLimit.max,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
  },
});
app.use(limiter);

// Enable CORS
app.use(cors(corsOptions));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: APP_LIMITS.BODY_PARSER_JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: APP_LIMITS.BODY_PARSER_URLENCODED_LIMIT }));
app.use(cookieParser());

// Data compression
app.use(compression());

// Mount Centralized Router
app.use(router);

// Handle unhandled routes (404)
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(ERROR_MESSAGES.ROUTE_NOT_FOUND.replace('{url}', req.originalUrl)));
});

// Global Error Handler
app.use(errorHandler);

export default app;
