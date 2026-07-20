import { Response } from 'express';
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../config/cookie.config';

/**
 * Sets secure HTTP-only cookies for Access and Refresh tokens.
 */
export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  res.cookie('accessToken', accessToken, accessTokenCookieOptions);
  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
};

/**
 * Clears Access and Refresh token cookies on logout.
 */
export const clearAuthCookies = (res: Response): void => {
  res.clearCookie('accessToken', accessTokenCookieOptions);
  res.clearCookie('refreshToken', refreshTokenCookieOptions);
};
