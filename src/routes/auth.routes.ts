import { Router } from 'express';
import { authController } from '../controllers';
import { validateBody, authenticate, asyncHandler } from '../middlewares';
import { registerBodySchema, loginBodySchema, refreshTokenBodySchema } from '../validators';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account, hashes the password, and returns user details with an access token and HTTP-only refresh cookie.
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
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Validation failed (invalid email or weak password).
 *       409:
 *         description: Email already in use.
 */
router.post('/register', validateBody(registerBodySchema), asyncHandler(authController.register));

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     description: Authenticates user credentials and returns an access token with an HTTP-only refresh cookie.
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
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin@12345
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid email or password.
 */
router.post('/login', validateBody(loginBodySchema), asyncHandler(authController.login));

/**
 * @openapi
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh Access Token
 *     description: Issues a new access token using the HTTP-only refresh cookie or request body token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *       401:
 *         description: Invalid or expired refresh token.
 */
router.post(
  '/refresh-token',
  validateBody(refreshTokenBodySchema),
  asyncHandler(authController.refreshToken)
);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: User Logout
 *     description: Clears authentication cookies to log out the user.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logged out successfully.
 */
router.post('/logout', asyncHandler(authController.logout));

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get Current User Profile
 *     description: Returns the profile data of the currently authenticated user. Requires Bearer Token.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
 *       401:
 *         description: Unauthorized. Missing or invalid access token.
 */
router.get('/me', authenticate, asyncHandler(authController.getProfile));

export default router;
