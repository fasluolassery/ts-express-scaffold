import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import asyncHandler from './async.middleware';

/**
 * Validates request body against a Zod schema.
 * Replaces req.body with the successfully parsed and casted value.
 */
export const validateBody = (schema: z.ZodTypeAny) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    req.body = await schema.parseAsync(req.body ?? {});
    next();
  });

/**
 * Validates request query parameters against a Zod schema.
 */
export const validateQuery = (schema: z.ZodTypeAny) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const parsed = await schema.parseAsync(req.query ?? {});
    req.query = parsed as typeof req.query;
    next();
  });

/**
 * Validates request route parameters (req.params) against a Zod schema.
 */
export const validateParams = (schema: z.ZodTypeAny) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const parsed = await schema.parseAsync(req.params ?? {});
    req.params = parsed as typeof req.params;
    next();
  });

export default validateBody;
