import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { AppError } from '../utils/appError';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Login user and return JWT token
   */
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body; // Changed username to email
      const result = await this.userService.login(email, password); // Changed username to email
      
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh access token using refresh token
   */
  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const result = await this.userService.refreshToken(refreshToken);
      
      return res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all users (admin/manager only)
   */
  public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();
      
      return res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user by ID
   */
  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }
      
      return res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current authenticated user
   */
  public getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Authentication required', 401);
      }
      
      const user = await this.userService.getUserById(req.user.id);
      
      return res.status(200).json({
        success: true,
        message: 'Current user retrieved successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new user (admin only)
   */
  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const newUser = await this.userService.createUser(userData);
      
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user (admin only)
   */
  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await this.userService.updateUser(id, userData);
      
      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user (admin only)
   */
  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);
      
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update current user profile
   */
  public updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Authentication required', 401);
      }
      
      const userData = req.body;
      const updatedUser = await this.userService.updateProfile(req.user.id, userData);
      
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Change current user password
   */
  public changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Authentication required', 401);
      }
      
      const { currentPassword, newPassword } = req.body;
      await this.userService.changePassword(req.user.id, currentPassword, newPassword);
      
      return res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
