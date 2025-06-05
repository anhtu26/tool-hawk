import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Utility service for common database operations
 */
export class UtilsService {
  /**
   * Check if a record exists in a table by ID
   * @param model Prisma model name
   * @param id Record ID
   * @returns Promise<boolean>
   */
  static async recordExists(model: string, id: string): Promise<boolean> {
    try {
      // @ts-ignore - Dynamic model access
      const record = await prisma[model].findUnique({
        where: { id },
        select: { id: true },
      });
      return !!record;
    } catch (error) {
      console.error(`Error checking if record exists in ${model}:`, error);
      return false;
    }
  }

  /**
   * Generate a sequential number with prefix
   * @param model Prisma model name
   * @param prefix Prefix for the number (e.g., 'PO-', 'TOOL-')
   * @param field Field to check for existing numbers
   * @returns Promise<string> - Generated number (e.g., 'PO-0001')
   */
  static async generateSequentialNumber(
    model: string,
    prefix: string,
    field: string
  ): Promise<string> {
    try {
      // @ts-ignore - Dynamic model access
      const lastRecord = await prisma[model].findFirst({
        where: {
          [field]: {
            startsWith: prefix,
          },
        },
        orderBy: {
          [field]: 'desc',
        },
        select: {
          [field]: true,
        },
      });

      let nextNumber = 1;
      
      if (lastRecord) {
        const lastNumberStr = lastRecord[field].replace(prefix, '');
        const lastNumber = parseInt(lastNumberStr, 10);
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }

      // Format with leading zeros (4 digits)
      return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
    } catch (error) {
      console.error(`Error generating sequential number for ${model}:`, error);
      // Fallback to timestamp-based number
      return `${prefix}${Date.now().toString().slice(-8)}`;
    }
  }

  /**
   * Create audit log entry
   * @param data Audit log data
   * @returns Promise<void>
   */
  static async createAuditLog(data: {
    userId?: string;
    actionType: string;
    entityType?: string;
    entityId?: string;
    detailsBefore?: any;
    detailsAfter?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    try {
      await prisma.auditLog.create({
        data,
      });
    } catch (error) {
      console.error('Error creating audit log:', error);
    }
  }

  /**
   * Check if user has permission for an action
   * @param userId User ID
   * @param requiredRole Minimum role required
   * @returns Promise<boolean>
   */
  static async hasPermission(
    userId: string,
    requiredRole: 'admin' | 'manager' | 'operator'
  ): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) return false;

      // Role hierarchy: admin > manager > operator
      if (requiredRole === 'admin') {
        return user.role === 'admin';
      } else if (requiredRole === 'manager') {
        return ['admin', 'manager'].includes(user.role);
      } else {
        // All roles can perform operator-level actions
        return true;
      }
    } catch (error) {
      console.error('Error checking user permission:', error);
      return false;
    }
  }
}
