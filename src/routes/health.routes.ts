import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { APP_ROUTES, HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';
import asyncHandler from '../middlewares/async.middleware';
import { sendSuccess, sendError } from '../utils/api-response';

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: System Health Check
 *     description: Returns the health status of the API server and database connectivity. If database is unreachable, returns 503.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: System is fully operational and healthy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - message
 *                 - data
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: System is healthy
 *                 data:
 *                   type: object
 *                   required:
 *                     - timestamp
 *                     - uptime
 *                     - details
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-07-02T13:00:37.000Z"
 *                     uptime:
 *                       type: number
 *                       example: 120.45
 *                     details:
 *                       type: object
 *                       required:
 *                         - database
 *                       properties:
 *                         database:
 *                           type: object
 *                           required:
 *                             - status
 *                             - latency
 *                           properties:
 *                             status:
 *                               type: string
 *                               example: UP
 *                             latency:
 *                               type: string
 *                               example: 5ms
 *       503:
 *         description: One or more dependencies are unhealthy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - message
 *                 - errors
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: System is unhealthy
 *                 errors:
 *                   type: object
 *                   required:
 *                     - database
 *                   properties:
 *                     database:
 *                       type: string
 *                       example: "Database connection is in 'disconnected' state."
 */
router.get(
  APP_ROUTES.HEALTH_CHECK,
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

export default router;
