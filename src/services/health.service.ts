import mongoose from 'mongoose';

export interface HealthCheckResult {
  isHealthy: boolean;
  dbStatus: 'UP' | 'DOWN';
  dbLatency?: string;
  dbError?: string;
}

export class HealthService {
  /**
   * Checks database connectivity and latency.
   */
  public static async checkHealth(): Promise<HealthCheckResult> {
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
        const states: Record<number, string> = {
          0: 'disconnected',
          2: 'connecting',
          3: 'disconnecting',
        };
        const currentState = states[mongoose.connection.readyState] || 'unknown';
        dbError = `Database connection is in '${currentState}' state.`;
      }
    } catch (err) {
      dbError = err instanceof Error ? err.message : String(err);
    }

    return {
      isHealthy: dbStatus === 'UP',
      dbStatus,
      ...(dbLatency !== undefined && { dbLatency }),
      ...(dbError !== undefined && { dbError }),
    };
  }
}

export default HealthService;
