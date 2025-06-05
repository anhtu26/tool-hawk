import { PrismaClient } from '@prisma/client';
import { UtilsService } from './utils.service';

const prisma = new PrismaClient();

export const ToolService = {
  /**
   * Get tools with filtering and pagination
   */
  async getTools(params: {
    categoryId?: string;
    status?: string;
    search?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { 
      categoryId, 
      status, 
      search, 
      page = '1', 
      limit = '10',
      sortBy = 'name',
      sortOrder = 'asc'
    } = params;

    // Build filter
    const filter: any = {};
    
    if (categoryId) {
      filter.categoryId = categoryId;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      filter.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { toolNumber: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Parse pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
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
          [sortBy]: sortOrder
        },
        skip,
        take: limitNum
      }),
      prisma.tool.count({ where: filter })
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);

    return {
      data: tools,
      meta: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    };
  },

  /**
   * Get tool by ID
   */
  async getToolById(id: string) {
    return prisma.tool.findUnique({
      where: { id },
      include: {
        category: true,
        primaryVendor: true,
        documentAttachments: true
      }
    });
  },

  /**
   * Validate tool data
   */
  async validateToolData(data: any, isUpdate = false) {
    const errors = [];

    // Check if category exists if provided
    if (data.categoryId) {
      const categoryExists = await prisma.toolCategory.findUnique({
        where: { id: data.categoryId },
        select: { id: true }
      });

      if (!categoryExists) {
        errors.push('Invalid category ID');
      }
    }

    // Check if vendor exists if provided
    if (data.primaryVendorId) {
      const vendorExists = await prisma.vendor.findUnique({
        where: { id: data.primaryVendorId },
        select: { id: true }
      });

      if (!vendorExists) {
        errors.push('Invalid vendor ID');
      }
    }

    return errors;
  },

  /**
   * Create new tool
   */
  async createTool(data: any, userId: string) {
    // Generate tool number
    const toolNumber = await UtilsService.generateSequentialNumber('tool', 'TOOL-', 'toolNumber');

    // Create tool
    const tool = await prisma.tool.create({
      data: {
        ...data,
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

    return tool;
  },

  /**
   * Update existing tool
   */
  async updateTool(id: string, data: any, userId: string) {
    // Get existing tool
    const existingTool = await prisma.tool.findUnique({
      where: { id }
    });

    if (!existingTool) {
      return null;
    }

    // Update tool
    const updatedTool = await prisma.tool.update({
      where: { id },
      data: {
        ...data,
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

    return updatedTool;
  },

  /**
   * Delete tool
   */
  async deleteTool(id: string, userId: string) {
    // Check if tool exists
    const existingTool = await prisma.tool.findUnique({
      where: { id }
    });

    if (!existingTool) {
      return null;
    }

    // Check if tool is in use
    const activeCheckouts = await prisma.toolCheckout.count({
      where: {
        toolId: id,
        status: 'CHECKED_OUT'
      }
    });

    if (activeCheckouts > 0) {
      throw new Error('Cannot delete tool that is currently checked out');
    }

    // Delete tool
    const deletedTool = await prisma.tool.update({
      where: { id },
      data: { status: 'ARCHIVED' }
    });

    // Create audit log
    await UtilsService.createAuditLog({
      userId,
      actionType: 'TOOL_DELETE',
      entityType: 'Tool',
      entityId: id,
      detailsBefore: existingTool,
      detailsAfter: deletedTool
    });

    return deletedTool;
  }
};
