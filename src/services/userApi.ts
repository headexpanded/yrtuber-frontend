import { api } from 'boot/axios';
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileData,
  UpdatePasswordData,
  AuthResponse,
  ApiError
} from "src/types/user";

// Extended error type for axios errors
type AxiosError = {
  response?: {
    data: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  request?: unknown;
  message?: string;
};

export class UserApiService {
  // Authentication endpoints
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      await api.post('/api/login', credentials, { withCredentials: true });
      // After successful login, fetch user data
      const user = await this.getCurrentUser();
      return { user };
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      await api.post('/api/register', credentials, { withCredentials: true });
      // After successful registration, fetch user data
      const user = await this.getCurrentUser();
      return { user };
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  static async logout(): Promise<void> {
    try {
      await api.post('/api/logout', {}, { withCredentials: true });
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  // User data endpoints
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/api/user', { withCredentials: true });
      return response.data.data; // Extract user data from nested data object
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  static async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      const response = await api.put('/api/profile', data, { withCredentials: true });
      // The backend returns { message: '...', user: User }
      return response.data.user;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  static async updatePassword(data: UpdatePasswordData): Promise<{ message: string }> {
    try {
      const response = await api.put('/api/user/password', data, { withCredentials: true });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  static async deleteAccount(password: string): Promise<{ message: string }> {
    try {
      const response = await api.delete('/api/user', {
        data: { password },
        withCredentials: true
      });
      return response.data;
    } catch (error: unknown) {
      const apiError = this.handleApiError(error as AxiosError);
      throw new Error(apiError.message);
    }
  }

  // Utility methods
  private static handleApiError(error: AxiosError): ApiError {
    if (error.response?.data) {
      const result: ApiError = {
        message: error.response.data.message || 'An error occurred'
      };

      if (error.response.data.errors) {
        result.errors = error.response.data.errors;
      }

      return result;
    }

    if (error.request) {
      return {
        message: 'Network error - unable to reach the server'
      };
    }

    return {
      message: error.message || 'An unexpected error occurred'
    };
  }
}
