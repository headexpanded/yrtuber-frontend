import { api } from 'boot/axios';
import type { User } from 'src/types/User';

export type AuthResponse = {
  user: User;
  message?: string;
};

export type AuthCheckResponse = {
  authenticated: boolean;
  user?: User;
};

export class AuthApiService {
  /**
   * Refresh the user's session to keep them logged in
   */
  static async refreshSession(): Promise<AuthResponse> {
    const response = await api.post('/auth/refresh-session');
    return response.data;
  }

  /**
   * Check if the user is currently authenticated
   */
  static async checkAuth(): Promise<AuthCheckResponse> {
    try {
      const response = await api.get('/auth/check');
      return response.data;
    } catch (error: unknown) {
      // If we get a 401, the user is not authenticated
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 401) {
        return { authenticated: false };
      }
      throw error;
    }
  }
}
