import { Request, Response, NextFunction } from 'express';
import asyncHandler from './async.middleware';
import { UnauthorizedError, ForbiddenError } from '../errors';
import { ERROR_MESSAGES } from '../constants';
import { verifyAccessToken } from '../utils';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export type AuthenticatedRequest = Request;

/**
 * Extract token from Authorization Bearer header or HTTP-only cookie.
 */
const extractTokenFromRequest = (req: Request): string | undefined => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }
  return undefined;
};

/**
 * Middleware to authenticate requests using access token.
 */
export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const token = extractTokenFromRequest(req);

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

/**
 * Middleware factory for Role-Based Access Control (RBAC).
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    next();
  };
};

export default authenticate;
