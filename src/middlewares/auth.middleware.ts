import { Request, Response, NextFunction } from 'express';
import asyncHandler from './async.middleware';
import { UnauthorizedError } from '../errors';
import { ERROR_MESSAGES } from '../constants';
import { verifyAccessToken } from '../utils';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

/**
 * Middleware to authenticate requests using access token from Authorization header or cookie.
 */
export const authenticate = asyncHandler(
  async (req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    // Check Authorization header or HTTP-only accessToken cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    try {
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.sub,
        role: decoded.role,
      };
      next();
    } catch {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }
);

export default authenticate;
