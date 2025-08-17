import { api } from 'boot/axios';
import { defineStore } from 'pinia';
import { UserApiService } from '../services/userApi';
import type { LoginCredentials, RegisterCredentials, User } from "src/types/user";

type State = {
  user: User | null;
  csrfFetched: boolean;
  isLoading: boolean;
  error: string | null;
};

type Getters = {
  isAuthenticated: (state: State) => boolean;
  username: (state: State) => string | null;
  email: (state: State) => string | null;
  profile: (state: State) => User['profile'] | null;
};

type Actions = {
  init: () => Promise<void>;
  ensureInitialized: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  fetchUser: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearState: () => void;
  clearError: () => void;
};

const defaultState: State = {
  user: null,
  csrfFetched: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = defineStore<'auth', State, Getters, Actions>('auth', {
  state: () => ({ ...defaultState }),
  // persist: true,
  getters: {
    isAuthenticated: (state) => !!state.user,
    username: (state) => state.user?.username || null,
    email: (state) => state.user?.email || null,
    profile: (state) => state.user?.profile || null,
  },

  actions: {
    async init() {
      if (!this.csrfFetched) {
        // Fetch CSRF cookie from the correct Sanctum endpoint
        await api.get(`/sanctum/csrf-cookie`);
        this.csrfFetched = true;
      }
    },

    async ensureInitialized() {
      await this.init();
    },

    async login(credentials: LoginCredentials) {
      this.isLoading = true;
      this.error = null;

      try {
        // Ensure CSRF token is fetched before login
        await this.ensureInitialized();

        const response = await UserApiService.login(credentials);
        this.user = response.user;
        this.csrfFetched = true;
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
        // Ensure CSRF token is fetched before registration
        await this.ensureInitialized();

        const response = await UserApiService.register(credentials);
        this.user = response.user;
        this.csrfFetched = true;
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
        // Ensure CSRF token is fetched before fetching user
        await this.ensureInitialized();

        this.user = await UserApiService.getCurrentUser();
        this.csrfFetched = true;
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

    clearState() {
      this.user = null;
      this.csrfFetched = false;
      this.error = null;
    },

    clearError() {
      this.error = null;
    },
  },
});
