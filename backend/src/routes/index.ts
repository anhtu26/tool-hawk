import express, { Router } from 'express';
// Use a relative import that doesn't need type declarations
const healthRoutes = require('./healthRoutes').default;

const router: Router = express.Router();

// API version prefix
const API_PREFIX = '/api/v1';

// Register routes
router.use(`${API_PREFIX}/health`, healthRoutes);

// Add additional routes as they are implemented
// router.use(`${API_PREFIX}/users`, userRoutes);
// router.use(`${API_PREFIX}/categories`, categoryRoutes);
// router.use(`${API_PREFIX}/tools`, toolRoutes);
// router.use(`${API_PREFIX}/purchases`, purchaseHistoryRoutes);
// router.use(`${API_PREFIX}/parts`, partHistoryRoutes);

export default router;
