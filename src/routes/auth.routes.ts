import { Router } from 'express';
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getMe,
} from '../controllers/auth.controller';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators';
import { validateBody } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { APP_ROUTES } from '../constants';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user and auto-login
 *     description: Creates a new user profile (customer or worker), issues dual tokens, sets HTTP-only cookies, and returns user profile.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 128
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: [customer, worker]
 *                 default: customer
 *                 example: "customer"
 *     responses:
 *       201:
 *         description: User registered & logged in successfully. Sets accessToken and refreshToken HTTP-only cookies.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation failure or invalid input parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email address is already registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(APP_ROUTES.AUTH.REGISTER, validateBody(registerSchema), registerUser);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user credentials
 *     description: Validates email and password, generates fresh Access and Refresh tokens, and sets secure HTTP-only cookies.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful. Sets accessToken and refreshToken HTTP-only cookies.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(APP_ROUTES.AUTH.LOGIN, validateBody(loginSchema), loginUser);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Uses valid HTTP-only refreshToken cookie to issue a new short-lived Access Token and rotate the Refresh Token.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully. Rotates accessToken and refreshToken cookies.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Token refreshed successfully"
 *       401:
 *         description: Missing, invalid, or expired refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(APP_ROUTES.AUTH.REFRESH, validateBody(refreshTokenSchema), refreshToken);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Revokes user refresh token session in database and clears HTTP-only authentication cookies.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully. Clears authentication cookies.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *       401:
 *         description: Unauthorized session.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(APP_ROUTES.AUTH.LOGOUT, authenticate, logoutUser);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     description: Fetches user profile for current authenticated session via cookie or Bearer token.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User profile retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized session.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(APP_ROUTES.AUTH.ME, authenticate, getMe);

export default router;
