import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export class BaseController {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Send success response with optional data
   */
  protected sendSuccess(res: Response, data?: any, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Send error response with optional error details
   */
  protected sendError(res: Response, message: string = 'Error occurred', statusCode: number = 500, error?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV !== 'production' && error && { error })
    });
  }

  /**
   * Generic method to handle async operations and catch errors
   */
  protected async handleAsync(req: Request, res: Response, operation: () => Promise<any>) {
    try {
      const result = await operation();
      return this.sendSuccess(res, result);
    } catch (error) {
      console.error('Operation error:', error);
      return this.sendError(res, 'An error occurred while processing your request', 500, error);
    }
  }
}
