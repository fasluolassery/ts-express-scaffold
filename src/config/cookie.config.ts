import { CookieOptions } from 'express';
import config from './index';

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.cookie.secure,
  sameSite: config.cookie.sameSite,
  ...(config.cookie.domain && { domain: config.cookie.domain }),
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

export default cookieOptions;
