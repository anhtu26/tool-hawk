import { Router } from 'express';
import { toolsController } from '../controllers/tools.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/tools - Get all tools with filtering
router.get('/', toolsController.getTools);

// GET /api/tools/:id - Get tool by ID
router.get('/:id', toolsController.getToolById);

// POST /api/tools - Create new tool
router.post('/', toolsController.createTool);

// PUT /api/tools/:id - Update tool
router.put('/:id', toolsController.updateTool);

// DELETE /api/tools/:id - Delete tool
router.delete('/:id', toolsController.deleteTool);

export default router;
