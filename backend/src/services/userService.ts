import { PrismaClient, User, UserRole } from '@prisma/client';
import { AuthService, AuthTokens } from './user/authService';
import { UserCrudService, UserCreateInput, UserUpdateInput } from './user/userCrudService';
import { UserProfileService, ProfileUpdateInput } from './user/userProfileService';

/**
 * Main user service that combines all user-related functionality
 */
export class UserService {
  private prisma: PrismaClient;
  private authService: AuthService;
  private crudService: UserCrudService;
  private profileService: UserProfileService;

  constructor() {
    this.prisma = new PrismaClient();
    this.authService = new AuthService(this.prisma);
    this.crudService = new UserCrudService(this.prisma, this.authService);
    this.profileService = new UserProfileService(this.prisma, this.authService);
  }

  // Authentication methods
  public async login(email: string, password: string): Promise<AuthTokens> { // Changed username to email
    return this.authService.login(email, password); // Changed username to email
  }

  public async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return this.authService.refreshToken(refreshToken);
  }

  // User CRUD methods
  public async getAllUsers(): Promise<Partial<User>[]> {
    return this.crudService.getAllUsers();
  }

  public async getUserById(id: string): Promise<Partial<User> | null> {
    return this.crudService.getUserById(id);
  }

  public async createUser(userData: UserCreateInput): Promise<Partial<User>> {
    return this.crudService.createUser(userData);
  }

  public async updateUser(id: string, userData: UserUpdateInput): Promise<Partial<User>> {
    return this.crudService.updateUser(id, userData);
  }

  public async deleteUser(id: string): Promise<void> {
    return this.crudService.deleteUser(id);
  }

  // User profile methods
  public async updateProfile(userId: string, profileData: ProfileUpdateInput): Promise<Partial<User>> {
    return this.profileService.updateProfile(userId, profileData);
  }

  public async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    return this.profileService.changePassword(userId, currentPassword, newPassword);
  }
}

// Re-export types for external use
export { AuthTokens, UserCreateInput, UserUpdateInput, ProfileUpdateInput };
