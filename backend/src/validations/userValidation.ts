import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const userValidation = {
  // Login validation schema
  login: z.object({
    body: z.object({
      username: z.string().min(3, 'Username must be at least 3 characters'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
    }),
  }),

  // Refresh token validation schema
  refreshToken: z.object({
    body: z.object({
      refreshToken: z.string().min(1, 'Refresh token is required'),
    }),
  }),

  // Create user validation schema
  createUser: z.object({
    body: z.object({
      username: z.string().min(3, 'Username must be at least 3 characters'),
      email: z.string().email('Invalid email format'),
      password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      role: z.enum([UserRole.admin, UserRole.manager, UserRole.operator]),
    }),
  }),

  // Update user validation schema
  updateUser: z.object({
    params: z.object({
      id: z.string().min(1, 'User ID is required'),
    }),
    body: z.object({
      email: z.string().email('Invalid email format').optional(),
      firstName: z.string().min(1, 'First name is required').optional(),
      lastName: z.string().min(1, 'Last name is required').optional(),
      role: z.enum([UserRole.admin, UserRole.manager, UserRole.operator]).optional(),
      isActive: z.boolean().optional(),
    }),
  }),

  // Update profile validation schema
  updateProfile: z.object({
    body: z.object({
      email: z.string().email('Invalid email format').optional(),
      firstName: z.string().min(1, 'First name is required').optional(),
      lastName: z.string().min(1, 'Last name is required').optional(),
    }),
  }),

  // Change password validation schema
  changePassword: z.object({
    body: z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
      confirmPassword: z.string().min(1, 'Confirm password is required'),
    }).refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
  }),
};
