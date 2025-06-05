import express, { Router } from 'express';
import { VendorController } from '../controllers/vendorController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import { vendorValidation } from '../validations/vendorValidation';

const router: Router = express.Router();
const vendorController = new VendorController();

// All routes require authentication
router.use(authMiddleware);

// Routes accessible by all authenticated users
router.get('/', vendorController.getAllVendors);
router.get('/:id', vendorController.getVendorById);
router.get('/:id/tools', vendorController.getVendorTools);
router.get('/:id/purchase-orders', vendorController.getVendorPurchaseOrders);

// Routes accessible by admin and manager
router.post('/', authMiddleware(['admin', 'manager']), validateRequest(vendorValidation.createVendor), vendorController.createVendor);
router.put('/:id', authMiddleware(['admin', 'manager']), validateRequest(vendorValidation.updateVendor), vendorController.updateVendor);
router.delete('/:id', authMiddleware(['admin', 'manager']), vendorController.deleteVendor);

// Contact routes
router.post('/:id/contacts', authMiddleware(['admin', 'manager']), validateRequest(vendorValidation.createContact), vendorController.createContact);
router.put('/:id/contacts/:contactId', authMiddleware(['admin', 'manager']), validateRequest(vendorValidation.updateContact), vendorController.updateContact);
router.delete('/:id/contacts/:contactId', authMiddleware(['admin', 'manager']), vendorController.deleteContact);

export default router;
