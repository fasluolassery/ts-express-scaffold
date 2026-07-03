import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import requestLogger from './middlewares/logger.middleware';
import errorHandler from './middlewares/error.middleware';
import { NotFoundError } from './errors';
import router from './routes';
import corsOptions from './config/cors.config';
import { APP_LIMITS, ERROR_MESSAGES } from './constants';

const app = express();

// Security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors(corsOptions));

// Request Logging
app.use(requestLogger);

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
