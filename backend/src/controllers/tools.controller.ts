import { Request, Response } from 'express';
import { z } from 'zod';
import { UtilsService } from '../services/utils.service';
import { ToolService } from '../services/tool.service';

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
      const result = await ToolService.getTools({
        categoryId: req.query.categoryId as string,
        status: req.query.status as string,
        search: req.query.search as string,
        page: req.query.page as string,
        limit: req.query.limit as string,
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc'
      });

      return res.json(result);
    } catch (error) {
      console.error('Error getting tools:', error);
      return res.status(500).json({ error: 'Failed to get tools' });
    }
  },

  // Get tool by ID
  async getToolById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tool = await ToolService.getToolById(id);

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
      
      // Validate tool data
      const validationErrors = await ToolService.validateToolData(toolData);
      if (validationErrors.length > 0) {
        return res.status(400).json({ error: validationErrors[0] });
      }

      // Create tool
      const tool = await ToolService.createTool(toolData, userId);
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
      
      // Validate tool data
      const validationErrors = await ToolService.validateToolData(toolData, true);
      if (validationErrors.length > 0) {
        return res.status(400).json({ error: validationErrors[0] });
      }

      // Update tool
      const updatedTool = await ToolService.updateTool(id, toolData, userId);
      
      if (!updatedTool) {
        return res.status(404).json({ error: 'Tool not found' });
      }

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

      // Delete tool
      try {
        const deletedTool = await ToolService.deleteTool(id, userId);
        
        if (!deletedTool) {
          return res.status(404).json({ error: 'Tool not found' });
        }

        return res.json({ message: 'Tool deleted successfully' });
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }
    } catch (error) {
      console.error('Error deleting tool:', error);
      return res.status(500).json({ error: 'Failed to delete tool' });
    }
  },
};
