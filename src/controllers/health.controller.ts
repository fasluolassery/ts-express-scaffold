import { Request, Response } from 'express';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';
import { sendSuccess, sendError } from '../utils';
import asyncHandler from '../middlewares/async.middleware';
import { HealthService } from '../services';

/**
 * System Health Check controller.
 * Returns the health status of the API server and database connectivity.
 */
export const getHealth = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const { isHealthy, dbStatus, dbLatency, dbError } = await HealthService.checkHealth();

  if (isHealthy) {
    sendSuccess({
      res,
      statusCode: HTTP_STATUS.OK,
      message: SUCCESS_MESSAGES.HEALTH_CHECK,
      data: {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        details: {
          database: {
            status: dbStatus,
            latency: dbLatency,
          },
        },
      },
    });
  } else {
    sendError({
      res,
      statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
      message: ERROR_MESSAGES.SYSTEM_UNHEALTHY,
      errors: {
        database: dbError || ERROR_MESSAGES.DATABASE_UNREACHABLE,
      },
    });
  }
});

export default getHealth;
