import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';
import { normalizeOrigin } from '../../src/config/cors.config';

describe('Middleware Integration Suite', () => {
  describe('Request ID Correlation Middleware', () => {
    it('should generate and return a unique x-request-id header when none provided', async () => {
      const res = await request(app).get('/api/health');

      expect(res.headers['x-request-id']).toBeDefined();
      expect(typeof res.headers['x-request-id']).toBe('string');
      expect(res.headers['x-request-id'].length).toBeGreaterThan(0);
    });

    it('should preserve and propagate incoming x-request-id header', async () => {
      const customId = 'custom-trace-uuid-12345';
      const res = await request(app)
        .get('/api/health')
        .set('x-request-id', customId);

      expect(res.headers['x-request-id']).toBe(customId);
    });
  });

  describe('Error Handling Middleware', () => {
    it('should return 400 Bad Request when malformed JSON is sent in request body', async () => {
      const res = await request(app)
        .post('/api/health')
        .set('Content-Type', 'application/json')
        .send('{ "invalidJson": broken ');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/malformed json/i);
    });

    it('should return 404 Not Found for non-existent routes', async () => {
      const res = await request(app).get('/api/non-existent-endpoint');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('CORS Configuration', () => {
    it('should correctly strip trailing slashes in normalizeOrigin', () => {
      expect(normalizeOrigin('http://localhost:3000/')).toBe('http://localhost:3000');
      expect(normalizeOrigin('https://example.com///')).toBe('https://example.com');
      expect(normalizeOrigin('http://localhost:5000')).toBe('http://localhost:5000');
    });

    it('should accept requests from allowed origin even with trailing slash in request or config', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:5000/');

      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
