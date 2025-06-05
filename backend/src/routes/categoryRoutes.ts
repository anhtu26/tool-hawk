import express, { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import { categoryValidation } from '../validations/categoryValidation';

const router: Router = express.Router();
const categoryController = new CategoryController();

// All routes require authentication
router.use(authMiddleware);

// Routes accessible by all authenticated users
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/attributes', categoryController.getCategoryAttributes);
router.get('/:id/tools', categoryController.getCategoryTools);

// Routes accessible by admin and manager
router.post('/', authMiddleware(['admin', 'manager']), validateRequest(categoryValidation.createCategory), categoryController.createCategory);
router.put('/:id', authMiddleware(['admin', 'manager']), validateRequest(categoryValidation.updateCategory), categoryController.updateCategory);
router.delete('/:id', authMiddleware(['admin', 'manager']), categoryController.deleteCategory);

// Attribute group routes
router.post('/:id/attribute-groups', authMiddleware(['admin', 'manager']), validateRequest(categoryValidation.createAttributeGroup), categoryController.createAttributeGroup);
router.put('/:id/attribute-groups/:groupId', authMiddleware(['admin', 'manager']), validateRequest(categoryValidation.updateAttributeGroup), categoryController.updateAttributeGroup);
router.delete('/:id/attribute-groups/:groupId', authMiddleware(['admin', 'manager']), categoryController.deleteAttributeGroup);

// Category attribute routes
router.post('/:id/attributes', authMiddleware(['admin', 'manager']), validateRequest(categoryValidation.createAttribute), categoryController.createAttribute);
router.put('/:id/attributes/:attributeId', authMiddleware(['admin', 'manager']), validateRequest(categoryValidation.updateAttribute), categoryController.updateAttribute);
router.delete('/:id/attributes/:attributeId', authMiddleware(['admin', 'manager']), categoryController.deleteAttribute);

export default router;
