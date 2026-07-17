import { Router } from 'express';
import { registerUser } from '../controllers/auth.controller';
import { registerSchema } from '../validators';
import { validateBody } from '../middlewares/validation.middleware';
import { APP_ROUTES } from '../constants';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user profile as a customer or worker, hashes password, generates JWT, and registers user in database.
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
 *         description: User registered successfully. Returns details of the created user profile and the authorization token.
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
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "64a0f4439c2d1b70c382a8bf"
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           example: "john.doe@example.com"
 *                         role:
 *                           type: string
 *                           example: "customer"
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2026-07-02T13:00:37.000Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2026-07-02T13:00:37.000Z"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid input parameters or failed validation checks.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *                   example:
 *                     email: "Please enter a valid email address"
 *                     password: "Password must be at least 6 characters"
 *       409:
 *         description: Email is already registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email address is already registered"
 */
router.post(APP_ROUTES.AUTH.REGISTER, validateBody(registerSchema), registerUser);

export default router;
