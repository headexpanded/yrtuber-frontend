import { api } from 'boot/axios';
import { defineStore } from 'pinia';
import { AuthApiService } from 'src/services/authApi';
import { UserApiService } from 'src/services/userApi';
import type { LoginCredentials, RegisterCredentials, User } from "src/types/User";

type State = {
  user: User | null;
  csrfFetched: boolean;
  isLoading: boolean;
  error: string | null;
  sessionRefreshInterval: number | null;
};

type Getters = {
  isAuthenticated: (state: State) => boolean;
  username: (state: State) => string | null;
  email: (state: State) => string | null;
  profile: (state: State) => User['profile'] | null;
};

type Actions = {
  init: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  fetchUser: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  refreshSession: () => Promise<void>;
  startSessionRefresh: () => void;
  stopSessionRefresh: () => void;
  clearState: () => void;
  clearError: () => void;
};

const defaultState: State = {
  user: null,
  csrfFetched: false,
  isLoading: false,
  error: null,
  sessionRefreshInterval: null,
};

export const useAuthStore = defineStore<'auth', State, Getters, Actions>('auth', {
  state: () => ({ ...defaultState }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    username: (state) => state.user?.username || null,
    email: (state) => state.user?.email || null,
    profile: (state) => state.user?.profile || null,
  },

  actions: {
    async init() {
      if (!this.csrfFetched) {
        await api.get(`/sanctum/csrf-cookie`);
        this.csrfFetched = true;
      }
    },

    async login(credentials: LoginCredentials) {
      this.isLoading = true;
      this.error = null;

      try {
        await this.init();

        const response = await UserApiService.login(credentials);
        this.user = response.user;
        this.csrfFetched = true;

        // Start session refresh after successful login
        this.startSessionRefresh();
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Login failed';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      this.isLoading = true;

      try {
        await UserApiService.logout();
        this.clearState();
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Logout failed';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async register(credentials: RegisterCredentials) {
      this.isLoading = true;
      this.error = null;

      try {
        await this.init();

        const response = await UserApiService.register(credentials);
        this.user = response.user;
        this.csrfFetched = true;

        // Start session refresh after successful registration
        this.startSessionRefresh();
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Registration failed';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUser() {
      this.isLoading = true;
      this.error = null;

      try {
        await this.init();

        this.user = await UserApiService.getCurrentUser();
        this.csrfFetched = true;

        // Start session refresh if user is found
        this.startSessionRefresh();
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch user';
        this.clearState();
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async checkAuth(): Promise<boolean> {
      try {
        await this.fetchUser();
        return true;
      } catch {
        this.clearState();
        return false;
      }
    },

    async refreshSession() {
      try {
        const response = await AuthApiService.refreshSession();
        this.user = response.user;
      } catch (error) {
        console.error('Session refresh failed:', error);
        // If session refresh fails, clear the state
        this.clearState();
        throw error;
      }
    },

    startSessionRefresh() {
      // Stop any existing interval
      this.stopSessionRefresh();

      // Refresh session every 30 minutes (1800000 ms)
      this.sessionRefreshInterval = window.setInterval(() => {
        if (this.user) {
          void this.refreshSession().catch((error) => {
            console.error('Automatic session refresh failed:', error);
          });
        }
      }, 1800000); // 30 minutes
    },

    stopSessionRefresh() {
      if (this.sessionRefreshInterval) {
        clearInterval(this.sessionRefreshInterval);
        this.sessionRefreshInterval = null;
      }
    },

    clearState() {
      this.stopSessionRefresh();
      this.$patch(defaultState);
      this.user = null;
      this.csrfFetched = false;
      this.error = null;
    },

    clearError() {
      this.error = null;
    },
  },
});
