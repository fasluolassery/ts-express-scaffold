import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { LOG_FORMATS } from '../constants';

/**
 * Middleware that assigns a unique Correlation ID (UUIDv4) to every incoming HTTP request.
 * - Adopts existing 'x-request-id' header if provided by an upstream proxy/client.
 * - Generates a new cryptographic UUID if absent.
 * - Sets the correlation header on the HTTP response for end-to-end distributed tracing.
 */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const correlationHeader = LOG_FORMATS.CORRELATION_HEADER;
  const existingId = req.headers[correlationHeader];

  const requestId =
    typeof existingId === 'string' && existingId.trim().length > 0 ? existingId : randomUUID();

  req.id = requestId;
  res.setHeader(correlationHeader, requestId);

  next();
};

export default requestIdMiddleware;
