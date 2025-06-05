import { PrismaClient, User, UserRole } from '@prisma/client';
import { AppError } from '../../utils/appError';
import { AuthService } from './authService';

export interface UserCreateInput {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UserUpdateInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * Service handling user CRUD operations
 */
export class UserCrudService {
  private prisma: PrismaClient;
  private authService: AuthService;

  constructor(prisma: PrismaClient, authService: AuthService) {
    this.prisma = prisma;
    this.authService = authService;
  }

  /**
   * Get all users
   */
  public async getAllUsers(): Promise<Partial<User>[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users;
  }

  /**
   * Get user by ID
   */
  public async getUserById(id: string): Promise<Partial<User> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Create a new user
   */
  public async createUser(userData: UserCreateInput): Promise<Partial<User>> {
    // Check if username or email already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: userData.username },
          { email: userData.email },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.username === userData.username) {
        throw new AppError('Username already exists', 409);
      }
      throw new AppError('Email already exists', 409);
    }

    // Hash password
    const passwordHash = await this.authService.hashPassword(userData.password);

    // Create user
    const newUser = await this.prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      },
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

    return newUser;
  }

  /**
   * Update user
   */
  public async updateUser(id: string, userData: UserUpdateInput): Promise<Partial<User>> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if email already exists
    if (userData.email && userData.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new AppError('Email already exists', 409);
      }
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: userData,
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
   * Delete user
   */
  public async deleteUser(id: string): Promise<void> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Delete user
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
