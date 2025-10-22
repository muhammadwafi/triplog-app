import type {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  TokenVerifyResponse,
  User,
} from '@/types';
import type { AxiosResponse } from 'axios';
import apiClient from './api-client';

// Auth Service
class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const response: AxiosResponse<LoginResponse> =
      await apiClient.post<LoginResponse>('/auth/login/', credentials);
    return response.data.user;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<User> {
    const response: AxiosResponse<RegisterResponse> =
      await apiClient.post<RegisterResponse>('/auth/registration/', userData);
    return response.data.user;
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    await apiClient.post<void>('/auth/logout/');
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await apiClient.get('/auth/user/');
    return response.data;
  }

  /**
   * Update current user profile
   */
  async updateUser(userData: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await apiClient.patch<User>(
      '/auth/user/',
      userData,
    );
    return response.data;
  }

  /**
   * Verify if token is valid
   */
  async verifyToken(): Promise<boolean> {
    try {
      await apiClient.post<TokenVerifyResponse>('/auth/token/verify/');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<void> {
    await apiClient.post<void>('/auth/token/refresh/');
  }
}

export const authService = new AuthService();
export default authService;
