import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';
import { sendSuccess, sendError } from '../utils';
import asyncHandler from '../middlewares/async.middleware';

/**
 * System Health Check controller.
 * Returns the health status of the API server and database connectivity.
 */
export const getHealth = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  let dbStatus: 'UP' | 'DOWN' = 'DOWN';
  let dbLatency: string | undefined = undefined;
  let dbError: string | undefined = undefined;

  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected && mongoose.connection.db) {
      const start = Date.now();
      await mongoose.connection.db.admin().ping();
      const latency = Date.now() - start;
      dbStatus = 'UP';
      dbLatency = `${latency}ms`;
    } else {
      const states: { [key: number]: string } = {
        0: 'disconnected',
        2: 'connecting',
        3: 'disconnecting',
      };
      dbError = `Database connection is in '${states[mongoose.connection.readyState] || 'unknown'}' state.`;
    }
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
  }

  const overallHealthy = dbStatus === 'UP';

  if (overallHealthy) {
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
