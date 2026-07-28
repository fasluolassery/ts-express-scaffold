import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';

describe('System Health API Integration Suite', () => {
  describe('GET /api/health', () => {
    it('should return 200 OK and system status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data.details).toHaveProperty('database');
    });
  });
});
