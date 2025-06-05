import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Middleware to validate request body, query, and params using Zod schemas
 * @param schema - Zod schema for validation
 * @param source - Request property to validate ('body', 'query', 'params', or 'all')
 */
export const validate = (schema: AnyZodObject, source: 'body' | 'query' | 'params' | 'all' = 'body') => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (source === 'all') {
        // Validate body, query, and params
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params
        });
      } else {
        // Validate specific part of request
        await schema.parseAsync(req[source]);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      next(error);
    }
  };
