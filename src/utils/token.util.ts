import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';

/**
 * Generate a JWT token for the user.
 * @param userId User identifier
 * @param role User role
 * @returns JWT signed string
 */
export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ sub: userId, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as Exclude<SignOptions['expiresIn'], undefined>,
  });
};
