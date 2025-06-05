/**
 * Service for authentication-related API requests
 */
import api from './api';

// Define types for auth-related data
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'OPERATOR';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Auth service for handling authentication-related API requests
 */
const authService = {
  /**
   * Log in a user with email and password
   */
  login: (credentials: LoginCredentials) => {
    return api.post<AuthResponse>('/auth/login', credentials, { requiresAuth: false });
  },

  /**
   * Register a new user
   */
  register: (userData: RegisterData) => {
    return api.post<AuthResponse>('/auth/register', userData, { requiresAuth: false });
  },

  /**
   * Log out the current user
   */
  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Only make the API call if we have a refresh token
    if (refreshToken) {
      return api.post<void>('/auth/logout', { refreshToken });
    }
    
    return Promise.resolve();
  },

  /**
   * Refresh the access token using the refresh token
   */
  refreshToken: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return Promise.reject(new Error('No refresh token available'));
    }
    
    return api.post<{ accessToken: string, refreshToken: string }>(
      '/auth/refresh-token',
      { refreshToken },
      { requiresAuth: false }
    ).then(response => {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    });
  },

  /**
   * Get the current user's profile
   */
  getCurrentUser: () => {
    return api.get<User>('/auth/me');
  },

  /**
   * Request a password reset
   */
  requestPasswordReset: (data: ResetPasswordData) => {
    return api.post<void>('/auth/forgot-password', data, { requiresAuth: false });
  },

  /**
   * Change the current user's password
   */
  changePassword: (data: ChangePasswordData) => {
    return api.post<void>('/auth/change-password', data);
  },

  /**
   * Store authentication tokens in local storage
   */
  setAuthTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  /**
   * Check if the user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  }
};

export default authService;
