import { z } from 'zod';

/**
 * Validation schema for user registration request body.
 */
export const registerBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export type RegisterBodyType = z.infer<typeof registerBodySchema>;

/**
 * Validation schema for user login request body.
 */
export const loginBodySchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export type LoginBodyType = z.infer<typeof loginBodySchema>;

/**
 * Validation schema for refresh token request body.
 */
export const refreshTokenBodySchema = z.object({
  refreshToken: z.string().optional(),
});

export type RefreshTokenBodyType = z.infer<typeof refreshTokenBodySchema>;
