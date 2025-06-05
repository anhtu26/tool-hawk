import express, { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import { userValidation } from '../validations/userValidation';

const router: Router = express.Router();
const userController = new UserController();

// Public routes
router.post('/login', validateRequest(userValidation.login), userController.login);
router.post('/refresh-token', validateRequest(userValidation.refreshToken), userController.refreshToken);

// Protected routes
router.use(authMiddleware);

// Admin only routes
router.post('/', authMiddleware(['admin']), validateRequest(userValidation.createUser), userController.createUser);
router.put('/:id', authMiddleware(['admin']), validateRequest(userValidation.updateUser), userController.updateUser);
router.delete('/:id', authMiddleware(['admin']), userController.deleteUser);

// Admin and manager routes
router.get('/', authMiddleware(['admin', 'manager']), userController.getAllUsers);

// All authenticated users
router.get('/me', userController.getCurrentUser);
router.put('/me', validateRequest(userValidation.updateProfile), userController.updateProfile);
router.put('/me/password', validateRequest(userValidation.changePassword), userController.changePassword);
router.get('/:id', userController.getUserById);

export default router;
