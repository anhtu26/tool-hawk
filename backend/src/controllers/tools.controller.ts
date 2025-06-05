import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { UtilsService } from '../services/utils.service';

const prisma = new PrismaClient();

// Tool validation schema
const toolSchema = z.object({
  name: z.string().min(1, 'Tool name is required').max(100),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
  customAttributes: z.record(z.any()),
  currentQuantity: z.number().nonnegative().default(0),
  safeQuantity: z.number().nonnegative().default(0),
  maxQuantity: z.number().nonnegative().optional(),
  unitOfMeasure: z.string().min(1, 'Unit of measure is required'),
  costPerUnit: z.number().nonnegative().optional(),
  primaryVendorId: z.string().optional(),
  locationInShop: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE', 'DISCONTINUED', 'ARCHIVED']).default('ACTIVE'),
  lifespanExpected: z.number().int().positive().optional(),
  lifespanUnit: z.string().optional(),
});

export const toolsController = {
  // Get all tools with filtering
  async getTools(req: Request, res: Response) {
    try {
      const { 
        categoryId, 
        status, 
        search, 
        page = '1', 
        limit = '10',
        sortBy = 'name',
        sortOrder = 'asc'
      } = req.query;

      // Build filter
      const filter: any = {};
      
      if (categoryId) {
        filter.categoryId = categoryId as string;
      }
      
      if (status) {
        filter.status = status as string;
      }
      
      if (search) {
        filter.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { toolNumber: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } }
        ];
      }

      // Parse pagination
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      // Get tools with pagination
      const [tools, totalCount] = await Promise.all([
        prisma.tool.findMany({
          where: filter,
          include: {
            category: {
              select: { name: true }
            },
            primaryVendor: {
              select: { name: true }
            }
          },
          orderBy: {
            [sortBy as string]: sortOrder
          },
          skip,
          take: limitNum
        }),
        prisma.tool.count({ where: filter })
      ]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limitNum);

      return res.json({
        data: tools,
        meta: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          totalPages
        }
      });
    } catch (error) {
      console.error('Error getting tools:', error);
      return res.status(500).json({ error: 'Failed to get tools' });
    }
  },

  // Get tool by ID
  async getToolById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const tool = await prisma.tool.findUnique({
        where: { id },
        include: {
          category: true,
          primaryVendor: true,
          documentAttachments: true
        }
      });

      if (!tool) {
        return res.status(404).json({ error: 'Tool not found' });
      }

      return res.json(tool);
    } catch (error) {
      console.error('Error getting tool:', error);
      return res.status(500).json({ error: 'Failed to get tool' });
    }
  },

  // Create tool
  async createTool(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Validate request body
      const validationResult = toolSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Validation error', 
          details: validationResult.error.errors 
        });
      }

      const toolData = validationResult.data;

      // Check if category exists
      const categoryExists = await prisma.toolCategory.findUnique({
        where: { id: toolData.categoryId },
        select: { id: true }
      });

      if (!categoryExists) {
        return res.status(400).json({ error: 'Invalid category ID' });
      }

      // Check if vendor exists if provided
      if (toolData.primaryVendorId) {
        const vendorExists = await prisma.vendor.findUnique({
          where: { id: toolData.primaryVendorId },
          select: { id: true }
        });

        if (!vendorExists) {
          return res.status(400).json({ error: 'Invalid vendor ID' });
        }
      }

      // Generate tool number
      const toolNumber = await UtilsService.generateSequentialNumber('tool', 'TOOL-', 'toolNumber');

      // Create tool
      const tool = await prisma.tool.create({
        data: {
          ...toolData,
          toolNumber,
          createdByUserId: userId,
          updatedByUserId: userId
        }
      });

      // Create audit log
      await UtilsService.createAuditLog({
        userId,
        actionType: 'TOOL_CREATE',
        entityType: 'Tool',
        entityId: tool.id,
        detailsAfter: tool
      });

      return res.status(201).json(tool);
    } catch (error) {
      console.error('Error creating tool:', error);
      return res.status(500).json({ error: 'Failed to create tool' });
    }
  },

  // Update tool
  async updateTool(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Validate request body
      const validationResult = toolSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Validation error', 
          details: validationResult.error.errors 
        });
      }

      const toolData = validationResult.data;

      // Check if tool exists
      const existingTool = await prisma.tool.findUnique({
        where: { id }
      });

      if (!existingTool) {
        return res.status(404).json({ error: 'Tool not found' });
      }

      // Check if category exists if provided
      if (toolData.categoryId) {
        const categoryExists = await prisma.toolCategory.findUnique({
          where: { id: toolData.categoryId },
          select: { id: true }
        });

        if (!categoryExists) {
          return res.status(400).json({ error: 'Invalid category ID' });
        }
      }

      // Check if vendor exists if provided
      if (toolData.primaryVendorId) {
        const vendorExists = await prisma.vendor.findUnique({
          where: { id: toolData.primaryVendorId },
          select: { id: true }
        });

        if (!vendorExists) {
          return res.status(400).json({ error: 'Invalid vendor ID' });
        }
      }

      // Update tool
      const updatedTool = await prisma.tool.update({
        where: { id },
        data: {
          ...toolData,
          updatedByUserId: userId
        }
      });

      // Create audit log
      await UtilsService.createAuditLog({
        userId,
        actionType: 'TOOL_UPDATE',
        entityType: 'Tool',
        entityId: id,
        detailsBefore: existingTool,
        detailsAfter: updatedTool
      });

      return res.json(updatedTool);
    } catch (error) {
      console.error('Error updating tool:', error);
      return res.status(500).json({ error: 'Failed to update tool' });
    }
  },

  // Delete tool
  async deleteTool(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check if user has admin or manager role
      const hasPermission = await UtilsService.hasPermission(userId, 'manager');
      
      if (!hasPermission) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      // Check if tool exists
      const existingTool = await prisma.tool.findUnique({
        where: { id }
      });

      if (!existingTool) {
        return res.status(404).json({ error: 'Tool not found' });
      }

      // Check if tool has any checkouts
      const hasCheckouts = await prisma.toolCheckout.findFirst({
        where: { 
          toolId: id,
          status: { in: ['CHECKED_OUT', 'PARTIALLY_RETURNED'] }
        }
      });

      if (hasCheckouts) {
        return res.status(400).json({ 
          error: 'Cannot delete tool with active checkouts' 
        });
      }

      // Create audit log before deletion
      await UtilsService.createAuditLog({
        userId,
        actionType: 'TOOL_DELETE',
        entityType: 'Tool',
        entityId: id,
        detailsBefore: existingTool
      });

      // Delete tool
      await prisma.tool.delete({
        where: { id }
      });

      return res.json({ success: true, message: 'Tool deleted successfully' });
    } catch (error) {
      console.error('Error deleting tool:', error);
      return res.status(500).json({ error: 'Failed to delete tool' });
    }
  }
};
