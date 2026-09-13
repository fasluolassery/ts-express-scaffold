import { z } from 'zod';

/**
 * Standard Zod validation schema for paginated list query parameters.
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

export type PaginationQueryType = z.infer<typeof paginationQuerySchema>;

export default paginationQuerySchema;
