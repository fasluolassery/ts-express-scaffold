import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import asyncHandler from './async.middleware';

/**
 * Validates request body against a Zod schema.
 * Replaces req.body with the successfully parsed and casted value.
 */
export const validateBody = (schema: z.Schema) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    req.body = await schema.parseAsync(req.body ?? {});
    next();
  });

export default validateBody;
