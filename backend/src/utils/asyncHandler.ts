// backend/src/utils/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
// ParamsDictionary and ParsedQs are implicitly used by RequestHandler if not overridden by generics
// but importing them explicitly can sometimes help clarify or resolve issues if they were directly used in defaults.
// For this change, we are removing defaults, so their direct import for defaults is less critical.

/**
 * A generic type for asynchronous Express request handlers.
 */
export type AsyncRequestHandler<
  P, // No default type
  ResBody, // No default type
  ReqBody, // No default type
  ReqQuery, // No default type
  Locals extends Record<string, any> = Record<string, any> // Locals can retain its default
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
  res: Response<ResBody, Locals>,
  next: NextFunction
) => Promise<void>;

/**
 * Wraps an asynchronous request handler to automatically catch errors and pass them to next().
 * This avoids the need for try-catch blocks in every async route handler.
 * @param fn The asynchronous request handler function.
 * @returns An Express RequestHandler.
 */
export const asyncHandler = <
  P,
  ResBody,
  ReqBody,
  ReqQuery,
  Locals extends Record<string, any> = Record<string, any>
>(
  fn: AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>
): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
