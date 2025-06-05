import express, { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { CategoryController } from '../controllers/categoryController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import { categoryValidation } from '../validations/categoryValidation';

const router: Router = express.Router();
const categoryController = new CategoryController();

// All routes require authentication
router.use(authMiddleware);

// Routes accessible by all authenticated users
router.get('/', asyncHandler(categoryController.getAllCategories));
router.get('/:id', asyncHandler(categoryController.getCategoryById));
router.get('/:id/attributes', asyncHandler(categoryController.getCategoryAttributes));
// router.get('/:id/tools', categoryController.getCategoryTools); // Method commented out in controller

// Routes accessible by admin and manager
router.post('/', authMiddleware(['admin', 'manager']), validateRequest(categoryValidation.createCategory), asyncHandler(categoryController.createCategory));
router.put('/:id', authMiddleware(['admin', 'manager']), validateRequest(categoryValidation.updateCategory), asyncHandler(categoryController.updateCategory));
router.delete('/:id', authMiddleware(['admin', 'manager']), asyncHandler(categoryController.deleteCategory));

// Attribute group routes
router.post('/:id/attribute-groups', authMiddleware(['admin', 'manager']), validateRequest(categoryValidation.createAttributeGroup), asyncHandler(categoryController.createAttributeGroup));
router.put('/:id/attribute-groups/:groupId', authMiddleware(['admin', 'manager']), validateRequest(categoryValidation.updateAttributeGroup), asyncHandler(categoryController.updateAttributeGroup));
router.delete('/:id/attribute-groups/:groupId', authMiddleware(['admin', 'manager']), asyncHandler(categoryController.deleteAttributeGroup));

// Category attribute routes
router.post('/:id/attributes', authMiddleware(['admin', 'manager']), validateRequest(categoryValidation.createAttribute), asyncHandler(categoryController.createAttribute));
router.put('/:id/attributes/:attributeId', authMiddleware(['admin', 'manager']), validateRequest(categoryValidation.updateAttribute), asyncHandler(categoryController.updateAttribute));
router.delete('/:id/attributes/:attributeId', authMiddleware(['admin', 'manager']), asyncHandler(categoryController.deleteAttribute));

export default router;
