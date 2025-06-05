// backend/src/middleware/validateRequest.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateRequest = (
  schemas: {
    body?: AnyZodObject;
    query?: AnyZodObject;
    params?: AnyZodObject;
  }
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (schemas.body) {
      req.body = await schemas.body.parseAsync(req.body);
    }
    if (schemas.query) {
      req.query = await schemas.query.parseAsync(req.query);
    }
    if (schemas.params) {
      req.params = await schemas.params.parseAsync(req.params);
    }
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((issue: any) => ({
        field: issue.path.join('.'), // More specific field information
        message: issue.message,
      }));
      res.status(400).json({ error: 'Validation failed', details: errorMessages });
      return; // Ensure no further processing
    }
    // Handle other unexpected errors
    console.error('Unexpected validation error:', error); // Log unexpected errors
    res.status(500).json({ error: 'Internal server error during validation' });
    return; // Ensure no further processing
  }
};
