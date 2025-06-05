import { Request, Response } from 'express';
import { BaseController } from './baseController';

export class HealthController extends BaseController {
  /**
   * Simple health check endpoint to verify API is operational
   */
  async getHealth(req: Request, res: Response) {
    return this.handleAsync(req, res, async () => {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`.catch((error: Error) => {
        throw new Error(`Database connection failed: ${error.message}`);
      });
      
      return {
        status: 'healthy',
        timestamp: new Date(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      };
    });
  }
}
