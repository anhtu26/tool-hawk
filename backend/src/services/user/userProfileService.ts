import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AppError } from '../../utils/appError';
import { AuthService } from './authService';

export interface ProfileUpdateInput {
  email?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Service handling user profile and password management
 */
export class UserProfileService {
  private prisma: PrismaClient;
  private authService: AuthService;

  constructor(prisma: PrismaClient, authService: AuthService) {
    this.prisma = prisma;
    this.authService = authService;
  }

  /**
   * Update user profile
   */
  public async updateProfile(userId: string, profileData: ProfileUpdateInput): Promise<Partial<User>> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if email already exists
    if (profileData.email && profileData.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: profileData.email },
      });

      if (existingUser) {
        throw new AppError('Email already exists', 409);
      }
    }

    // Update profile
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: profileData,
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  /**
   * Change user password
   */
  public async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Hash new password
    const passwordHash = await this.authService.hashPassword(newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Revoke all refresh tokens
    await this.authService.revokeAllRefreshTokens(userId);
  }
}
