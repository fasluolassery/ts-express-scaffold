import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app';

describe('Authentication API Integration & Battle-Testing Suite', () => {
  const testUser = {
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    password: 'password123',
    role: 'customer',
  };

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user and return HTTP-only auth cookies', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/registered successfully/i);
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user.name).toBe(testUser.name);
      expect(res.body.data.user).not.toHaveProperty('password');

      // Verify Set-Cookie headers
      const cookies = res.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();
      expect(cookies.some((c) => c.includes('accessToken'))).toBe(true);
      expect(cookies.some((c) => c.includes('refreshToken'))).toBe(true);
    });

    it('should reject registration with duplicate email (409 Conflict)', async () => {
      // First registration
      await request(app).post('/api/auth/register').send(testUser);

      // Duplicate registration attempt
      const res = await request(app).post('/api/auth/register').send(testUser);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already registered/i);
    });

    it('should reject registration with invalid email or password too short (400 Bad Request)', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'A',
        email: 'invalid-email',
        password: '123',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('should successfully log in with valid credentials and return auth cookies', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email);

      const cookies = res.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();
      expect(cookies.some((c) => c.includes('accessToken'))).toBe(true);
    });

    it('should reject login with non-existent email (401 Unauthorized)', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });

    it('should reject login with incorrect password (401 Unauthorized)', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should retrieve profile when valid accessToken cookie is provided', async () => {
      const loginRes = await request(app).post('/api/auth/register').send(testUser);
      const cookies = loginRes.headers['set-cookie'] as unknown as string[];

      const meRes = await request(app).get('/api/auth/me').set('Cookie', cookies);

      expect(meRes.status).toBe(200);
      expect(meRes.body.success).toBe(true);
      expect(meRes.body.data.user.email).toBe(testUser.email);
    });

    it('should reject request when no authentication cookie is sent (401 Unauthorized)', async () => {
      const meRes = await request(app).get('/api/auth/me');

      expect(meRes.status).toBe(401);
      expect(meRes.body.success).toBe(false);
      expect(meRes.body.message).toMatch(/unauthorized/i);
    });

    it('should reject request with tampered/invalid token (401 Unauthorized)', async () => {
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Cookie', ['accessToken=invalid_tampered_jwt_token; Path=/']);

      expect(meRes.status).toBe(401);
      expect(meRes.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should rotate access & refresh tokens when valid refreshToken cookie is sent', async () => {
      const loginRes = await request(app).post('/api/auth/register').send(testUser);
      const cookies = loginRes.headers['set-cookie'] as unknown as string[];

      const refreshRes = await request(app).post('/api/auth/refresh').set('Cookie', cookies);

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body.success).toBe(true);
      expect(refreshRes.body.message).toMatch(/token refreshed/i);

      const newCookies = refreshRes.headers['set-cookie'] as unknown as string[];
      expect(newCookies).toBeDefined();
      expect(newCookies.some((c) => c.includes('accessToken'))).toBe(true);
    });

    it('should reject refresh token request when no refresh cookie is sent (401 Unauthorized)', async () => {
      const refreshRes = await request(app).post('/api/auth/refresh');

      expect(refreshRes.status).toBe(401);
      expect(refreshRes.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should successfully log out and invalidate session', async () => {
      const loginRes = await request(app).post('/api/auth/register').send(testUser);
      const cookies = loginRes.headers['set-cookie'] as unknown as string[];

      const logoutRes = await request(app).post('/api/auth/logout').set('Cookie', cookies);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);
      expect(logoutRes.body.message).toMatch(/logged out/i);

      // Verify cookies cleared
      const clearedCookies = logoutRes.headers['set-cookie'] as unknown as string[];
      expect(clearedCookies.some((c) => c.includes('accessToken=;'))).toBe(true);

      // Attempt GET /api/auth/me after logout
      const postLogoutMe = await request(app).get('/api/auth/me').set('Cookie', clearedCookies);

      expect(postLogoutMe.status).toBe(401);
    });
  });
});
