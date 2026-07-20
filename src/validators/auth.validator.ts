import { z } from 'zod';
import { VALIDATION_MESSAGES } from '../constants';

export const registerSchema = z.object({
  name: z
    .string({
      message: VALIDATION_MESSAGES.NAME_REQUIRED,
    })
    .min(2, VALIDATION_MESSAGES.NAME_MIN)
    .max(50, VALIDATION_MESSAGES.NAME_MAX)
    .trim(),
  email: z
    .string({
      message: VALIDATION_MESSAGES.EMAIL_REQUIRED,
    })
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
    .trim()
    .toLowerCase(),
  password: z
    .string({
      message: VALIDATION_MESSAGES.PASSWORD_REQUIRED,
    })
    .min(6, VALIDATION_MESSAGES.PASSWORD_MIN)
    .max(128, VALIDATION_MESSAGES.PASSWORD_MAX),
  role: z
    .enum(['customer', 'worker'], {
      message: VALIDATION_MESSAGES.ROLE_INVALID,
    })
    .optional()
    .default('customer'),
});

export const loginSchema = z.object({
  email: z
    .string({
      message: VALIDATION_MESSAGES.EMAIL_REQUIRED,
    })
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
    .trim()
    .toLowerCase(),
  password: z
    .string({
      message: VALIDATION_MESSAGES.PASSWORD_REQUIRED,
    })
    .min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED),
});

export const refreshTokenSchema = z
  .object({
    refreshToken: z.string().optional(),
  })
  .optional()
  .default({});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RefreshTokenSchemaType = z.infer<typeof refreshTokenSchema>;
