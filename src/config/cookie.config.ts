import { CookieOptions } from 'express';
import config from './index';
import { APP_ROUTES, COOKIE_MAX_AGE_MS } from '../constants';

/**
 * Base HTTP-only cookie configuration for application security.
 */
export const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.cookie.secure,
  sameSite: config.cookie.sameSite,
  path: '/',
  ...(config.cookie.domain && { domain: config.cookie.domain }),
};

/**
 * Cookie configuration for short-lived access tokens (15 minutes).
 */
export const accessTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: COOKIE_MAX_AGE_MS.ACCESS_TOKEN,
};

/**
 * Cookie configuration for long-lived refresh tokens (7 days).
 * Restricted to auth sub-routes so it is only transmitted on auth-related requests.
 */
export const refreshTokenCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: COOKIE_MAX_AGE_MS.REFRESH_TOKEN,
  path: `${APP_ROUTES.API_PREFIX}${APP_ROUTES.AUTH_PREFIX}`,
};
