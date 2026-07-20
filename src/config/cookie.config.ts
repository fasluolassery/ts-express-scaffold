import { CookieOptions } from 'express';
import config from './index';

/**
 * Base HTTP-only cookie configuration for application security.
 */
export const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.cookie.secure,
  sameSite: config.cookie.sameSite,
  ...(config.cookie.domain && { domain: config.cookie.domain }),
};

/**
 * Cookie configuration for short-lived access tokens (15 minutes).
 */
export const accessTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 15 * 60 * 1000, // 15 minutes
};

/**
 * Cookie configuration for long-lived refresh tokens (7 days).
 * Restricted to '/api/auth' path so it is only transmitted on auth-related requests.
 */
export const refreshTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/auth',
};
