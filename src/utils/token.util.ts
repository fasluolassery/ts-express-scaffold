import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';

export interface TokenPayload {
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate an Access Token for the user (short-lived).
 */
export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ sub: userId, role }, config.jwt.access.secret, {
    expiresIn: config.jwt.access.expiresIn as Exclude<SignOptions['expiresIn'], undefined>,
  });
};

/**
 * Generate a Refresh Token for the user (long-lived).
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ sub: userId }, config.jwt.refresh.secret, {
    expiresIn: config.jwt.refresh.expiresIn as Exclude<SignOptions['expiresIn'], undefined>,
  });
};

/**
 * Verify an Access Token.
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt.access.secret) as TokenPayload;
};

/**
 * Verify a Refresh Token.
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, config.jwt.refresh.secret) as RefreshTokenPayload;
};
