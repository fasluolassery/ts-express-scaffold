import { Response, CookieOptions } from 'express';
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../config/cookie.config';
import { COOKIE_KEYS } from '../constants';

/**
 * Sets a generic HTTP-only cookie on the response.
 */
export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions
): void => {
  res.cookie(name, value, options);
};

/**
 * Clears a generic HTTP-only cookie from the response.
 */
export const clearCookie = (res: Response, name: string, options: CookieOptions): void => {
  res.clearCookie(name, options);
};

/**
 * Sets secure HTTP-only cookies for Access and Refresh tokens.
 */
export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  setCookie(res, COOKIE_KEYS.ACCESS_TOKEN, accessToken, accessTokenCookieOptions);
  setCookie(res, COOKIE_KEYS.REFRESH_TOKEN, refreshToken, refreshTokenCookieOptions);
};

/**
 * Clears Access and Refresh token cookies on logout.
 */
export const clearAuthCookies = (res: Response): void => {
  clearCookie(res, COOKIE_KEYS.ACCESS_TOKEN, accessTokenCookieOptions);
  clearCookie(res, COOKIE_KEYS.REFRESH_TOKEN, refreshTokenCookieOptions);
};
