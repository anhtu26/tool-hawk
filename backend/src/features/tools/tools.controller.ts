// backend/src/features/tools/tools.controller.ts
import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler'; // Adjusted path
import { CreateToolInput, GetToolParams, ListToolsQuery, UpdateToolInput } from './tools.schemas';
import prisma from '../../utils/prisma';

export const createToolHandler = asyncHandler(
  async (req: Request<{}, {}, CreateToolInput>, res: Response) => {
    const { customAttributes, ...toolData } = req.body;

    // Placeholder for authenticated user ID - replace with actual auth later
    const placeholderUserId = 'cluser00000000000000000000'; // Example CUID

    try {
      const newTool = await prisma.tool.create({
        data: {
          ...toolData,
          customAttributes: customAttributes || {},
          createdByUserId: placeholderUserId,
          updatedByUserId: placeholderUserId,
          // Prisma will handle default values for createdAt, updatedAt, id, status etc.
        },
      });

      res.status(201).json({
        message: 'Tool created successfully',
        data: newTool,
      });
    } catch (error) {
      // Log the error for debugging
      console.error('Error creating tool:', error);

      // Handle potential Prisma errors, e.g., unique constraint violation
      if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        // P2002 is Prisma's unique constraint violation code
        // The 'meta' field in the error object often contains the target fields
        const target = (error as any).meta?.target || ['unknown field'];
        res.status(409).json({
          message: `Conflict: A tool with this ${target.join(', ')} already exists.`,
          error: error.message
        });
        return;
      }

      res.status(500).json({ 
        message: 'Failed to create tool due to an internal server error.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

export const getToolHandler = asyncHandler(
  async (req: Request<GetToolParams>, res: Response) => {
    const { toolId } = req.params;

    try {
      const tool = await prisma.tool.findUnique({
        where: { id: toolId },
      });

      if (!tool) {
        res.status(404).json({ message: 'Tool not found' });
        return;
      }

      res.status(200).json({
        message: 'Tool retrieved successfully',
        data: tool,
      });
    } catch (error) {
      console.error(`Error retrieving tool ${toolId}:`, error);
      res.status(500).json({ 
        message: 'Failed to retrieve tool due to an internal server error.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

export const listToolsHandler = asyncHandler(
  async (req: Request<{}, {}, {}, ListToolsQuery>, res: Response) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', categoryId, vendorId, search } = req.query;

    const skip = (page - 1) * limit;

    // Basic where clause construction
    const where: any = {}; // Prisma.ToolWhereInput - consider importing for stricter typing
    if (categoryId) where.categoryId = categoryId;
    if (vendorId) where.primaryVendorId = vendorId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { toolNumber: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    try {
      const tools = await prisma.tool.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      });

      const totalItems = await prisma.tool.count({ where });
      const totalPages = Math.ceil(totalItems / limit);

      res.status(200).json({
        message: 'Tools listed successfully',
        data: tools,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
        },
      });
    } catch (error) {
      console.error('Error listing tools:', error);
      res.status(500).json({ 
        message: 'Failed to list tools due to an internal server error.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

export const updateToolHandler = asyncHandler(
  async (req: Request<GetToolParams, {}, UpdateToolInput>, res: Response) => {
    const { toolId } = req.params;
    const { customAttributes, ...updateData } = req.body;

    // Placeholder for authenticated user ID - replace with actual auth later
    const placeholderUserId = 'cluser00000000000000000000'; // Example CUID

    try {
      const tool = await prisma.tool.findUnique({
        where: { id: toolId },
      });

      if (!tool) {
        res.status(404).json({ message: 'Tool not found, cannot update.' });
        return;
      }

      const updatedTool = await prisma.tool.update({
        where: { id: toolId },
        data: {
          ...updateData,
          ...(customAttributes && { customAttributes: customAttributes }), // Only update if provided
          updatedByUserId: placeholderUserId,
          updatedAt: new Date(), // Explicitly set updatedAt
        },
      });

      res.status(200).json({
        message: 'Tool updated successfully',
        data: updatedTool,
      });
    } catch (error) {
      console.error(`Error updating tool ${toolId}:`, error);
      // Handle potential Prisma errors, e.g., unique constraint violation if toolNumber is changed to an existing one
      if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        const target = (error as any).meta?.target || ['unknown field'];
        res.status(409).json({
          message: `Conflict: A tool with this ${target.join(', ')} already exists.`,
          error: error.message
        });
        return;
      }
      res.status(500).json({ 
        message: 'Failed to update tool due to an internal server error.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

export const deleteToolHandler = asyncHandler(
  async (req: Request<GetToolParams>, res: Response) => {
    const { toolId } = req.params;

    try {
      const tool = await prisma.tool.findUnique({
        where: { id: toolId },
      });

      if (!tool) {
        res.status(404).json({ message: 'Tool not found, cannot delete.' });
        return;
      }

      await prisma.tool.delete({
        where: { id: toolId },
      });

      res.status(200).json({ message: 'Tool deleted successfully' }); // Or 204 No Content
    } catch (error) {
      console.error(`Error deleting tool ${toolId}:`, error);
      res.status(500).json({ 
        message: 'Failed to delete tool due to an internal server error.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

