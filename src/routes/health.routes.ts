import { Router } from 'express';
import { APP_ROUTES } from '../constants';
import { getHealth } from '../controllers';

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
router.get(APP_ROUTES.HEALTH, getHealth);

export default router;
