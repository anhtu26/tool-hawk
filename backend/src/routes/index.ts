import express, { Router } from 'express';
// Import routes
const healthRoutes = require('./healthRoutes').default;
const userRoutes = require('./userRoutes').default;
const categoryRoutes = require('./categoryRoutes').default;
const uploadRoutes = require('./upload.routes').default;
import toolRoutes from '../features/tools/tools.routes';

const router: Router = express.Router();

// API version prefix
const API_PREFIX = '/api/v1';

// Register routes
router.use(`${API_PREFIX}/health`, healthRoutes);
router.use(`${API_PREFIX}/users`, userRoutes);
router.use(`${API_PREFIX}/categories`, categoryRoutes);
router.use(`${API_PREFIX}/upload`, uploadRoutes);

// Add additional routes as they are implemented
router.use(`${API_PREFIX}/tools`, toolRoutes);
// router.use(`${API_PREFIX}/vendors`, vendorRoutes);
// router.use(`${API_PREFIX}/purchases`, purchaseOrderRoutes);
// router.use(`${API_PREFIX}/checkouts`, checkoutRoutes);

export default router;
