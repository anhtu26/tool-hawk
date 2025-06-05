// backend/src/features/tools/tools.routes.ts
import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest'; // Adjusted path
import { createToolSchema, getToolParamsSchema, listToolsQuerySchema, updateToolSchema } from './tools.schemas';
import { asyncHandler } from '../../utils/asyncHandler'; // Changed to named import
import { createToolHandler, getToolHandler, listToolsHandler, updateToolHandler, deleteToolHandler } from './tools.controller';
// import { authenticateToken } from '../../middleware/authMiddleware'; // For when auth is added

const router = Router();

// Create a new tool
// router.post('/', authenticateToken, validateRequest(createToolSchema), createToolHandler);
router.post('/', validateRequest({ body: createToolSchema }), createToolHandler); // Auth temporarily disabled

// Get a single tool by ID
router.get('/:toolId', validateRequest({ params: getToolParamsSchema }), getToolHandler);

// List tools with optional filtering and pagination
router.get('/', validateRequest({ query: listToolsQuerySchema }), listToolsHandler);

// Update a tool by ID
router.put('/:toolId', validateRequest({ params: getToolParamsSchema, body: updateToolSchema }), asyncHandler(updateToolHandler));

// Delete a tool by ID
router.delete('/:toolId', validateRequest({ params: getToolParamsSchema }), asyncHandler(deleteToolHandler));

export default router;
