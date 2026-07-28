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
 * Low-level generic helper to sign JWT tokens.
 */
export const signToken = <T extends object>(
  payload: T,
  secret: string,
  expiresIn: string | number
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as NonNullable<SignOptions['expiresIn']>,
  };
  return jwt.sign(payload, secret, options);
};

/**
 * Low-level generic helper to verify JWT tokens.
 */
export const verifyToken = <T>(token: string, secret: string): T => {
  return jwt.verify(token, secret) as T;
};

/**
 * Safely decodes a JWT token payload without verifying signature.
 */
export const decodeToken = <T>(token: string): T | null => {
  return jwt.decode(token) as T | null;
};

/**
 * Generate an Access Token for the user (short-lived).
 */
export const generateAccessToken = (userId: string, role: string): string => {
  return signToken<TokenPayload>(
    { sub: userId, role },
    config.jwt.access.secret,
    config.jwt.access.expiresIn
  );
};

/**
 * Generate a Refresh Token for the user (long-lived).
 */
export const generateRefreshToken = (userId: string): string => {
  return signToken<RefreshTokenPayload>(
    { sub: userId },
    config.jwt.refresh.secret,
    config.jwt.refresh.expiresIn
  );
};

/**
 * Verify an Access Token.
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  return verifyToken<TokenPayload>(token, config.jwt.access.secret);
};

/**
 * Verify a Refresh Token.
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return verifyToken<RefreshTokenPayload>(token, config.jwt.refresh.secret);
};
