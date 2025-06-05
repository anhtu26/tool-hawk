import { Response } from 'express';

declare global {
  namespace Express {
    interface Response {
      // Add any custom properties to Response here if needed
    }
  }
}

declare module 'express-serve-static-core' {
  interface RequestHandler {
    // This extends the RequestHandler to allow returning Response or Promise<Response>
    (req: Request, res: Response, next: NextFunction): void | Response | Promise<void | Response>;
  }
}

export {};
