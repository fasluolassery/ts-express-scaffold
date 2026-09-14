import request from 'supertest';
import { describe, it, expect, beforeEach } from '@jest/globals';
import app from '../../src/app';
import { UserModel } from '../../src/models';
import { USER_ROLES, HTTP_STATUS, AUTH_MESSAGES } from '../../src/constants';

describe('Authentication API Integration Suite', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    const validRegisterPayload = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123',
    };

    it('should register a new user successfully and return 201 with auth token', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validRegisterPayload)
        .expect(HTTP_STATUS.CREATED);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(AUTH_MESSAGES.REGISTER_SUCCESS);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.user.role).toBe(USER_ROLES.USER);
      expect(response.body.data.user.passwordHash).toBeUndefined(); // ensure hash not leaked
      expect(response.body.data.token).toBeDefined();

      // Ensure user saved in database
      const dbUser = await UserModel.findOne({ email: 'test@example.com' });
      expect(dbUser).not.toBeNull();
    });

    it('should reject registration with 409 Conflict if email is already taken', async () => {
      await UserModel.create({
        name: 'Existing',
        email: 'test@example.com',
        passwordHash: 'existingpass',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(validRegisterPayload)
        .expect(HTTP_STATUS.CONFLICT);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
    });

    it('should reject registration with 400 Bad Request if password is too short', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Short Pass',
          email: 'short@example.com',
          password: 'pass',
        })
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await UserModel.create({
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'Secret123',
        role: USER_ROLES.USER,
      });
    });

    it('should authenticate user and return 200 with tokens and cookies', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'Secret123',
        })
        .expect(HTTP_STATUS.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(AUTH_MESSAGES.LOGIN_SUCCESS);
      expect(response.body.data.user.email).toBe('john@example.com');
      expect(response.body.data.token).toBeDefined();

      // Check cookies
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
    });

    it('should reject login with 401 Unauthorized for incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'WrongPassword999',
        })
        .expect(HTTP_STATUS.UNAUTHORIZED);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(AUTH_MESSAGES.INVALID_CREDENTIALS);
    });

    it('should reject login with 401 Unauthorized for nonexistent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nobody@example.com',
          password: 'Secret123',
        })
        .expect(HTTP_STATUS.UNAUTHORIZED);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(AUTH_MESSAGES.INVALID_CREDENTIALS);
    });
  });

  describe('GET /api/auth/me', () => {
    let token: string;

    beforeEach(async () => {
      await UserModel.create({
        name: 'Profile User',
        email: 'profile@example.com',
        passwordHash: 'Profile123',
        role: USER_ROLES.ADMIN,
      });

      const loginRes = await request(app).post('/api/auth/login').send({
        email: 'profile@example.com',
        password: 'Profile123',
      });

      token = loginRes.body.data.token;
    });

    it('should return profile of the authenticated user when valid token is provided', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(HTTP_STATUS.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('profile@example.com');
      expect(response.body.data.role).toBe(USER_ROLES.ADMIN);
    });

    it('should reject profile request with 401 Unauthorized when no token is passed', async () => {
      const response = await request(app).get('/api/auth/me').expect(HTTP_STATUS.UNAUTHORIZED);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear authentication cookies and return 200 OK', async () => {
      const response = await request(app).post('/api/auth/logout').expect(HTTP_STATUS.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(AUTH_MESSAGES.LOGOUT_SUCCESS);
    });
  });
});
