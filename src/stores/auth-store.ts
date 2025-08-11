import { api } from 'boot/axios';
import { defineStore } from 'pinia';

type State = {
  username: string | null;
  email: string | null;
  csrfFetched: boolean;
  roles: string[];
};

type Getters = {
  isAdmin: (state: State) => boolean;
  isAuthenticated: (state: State) => boolean;
};

type Actions = {
  init: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    password_confirmation: string;
    username: string;
  }) => Promise<void>;
  fetchUser: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  checkTokenExpiration: () => void;
  clearState: () => void;
};

const defaultState: State = {
  username: null,
  email: null,
  csrfFetched: false,
  roles: [],
};

export const useAuthStore = defineStore<'auth', State, Getters, Actions>('auth', {
  state: () => ({ ...defaultState }),
  // persist: true,
  getters: {
    isAdmin: (state) => state.roles.includes('admin'),
    isAuthenticated: (state) => !!state.username,
  },

  actions: {
    async init() {
      if (!this.csrfFetched) {
        // Fetch CSRF cookie from the correct Sanctum endpoint
        await api.get('/sanctum/csrf-cookie');
        this.csrfFetched = true;
      }
    },

    checkTokenExpiration() {
      // Check if the access token is expired
    },

    async login(username: string, password: string) {
      await this.init();

      try {
        // Use Fortify's login endpoint
        await api.post('/api/login', { username, password }, { withCredentials: true });

        // Fortify login returns a redirect response, so we need to fetch the user data
        await this.fetchUser();
      } catch (err) {
        console.error('Login failed', err);
        throw err;
      }
    },

    async logout() {
      // Use Fortify's logout endpoint
      await api.post('/api/logout', {}, { withCredentials: true });
      this.clearState();
    },

    async register(payload: {
      email: string;
      password: string;
      password_confirmation: string;
      username: string;
    }) {
      await this.init();

      try {
        // Use Fortify's register endpoint
        await api.post('/api/register', payload, { withCredentials: true });

        // After successful registration, fetch user data
        // await this.fetchUser();
        console.log("Here I am")

        // const usersStore = useUsersStore();
        // await usersStore.fetchUsers();
      } catch (err) {
        console.error('Registration failed', err);
        throw err;
      }
    },

    async fetchUser(): Promise<void> {
      const response = await api.get('/api/user', { withCredentials: true });
      if (!response.data.username) {
        throw new Error('Missing username in response');
      }

      // Extract roles from is_admin field
      // const roles = response.data.is_admin ? ['admin'] : [];

      // this.$patch({
      //   roles: roles,
      //   username: response.data.username,
      //   supportedTeam: response.data.supportedTeam || { id: null, name: null, logo_url: null },
      // });
      return response.data;
    },

    async checkAuth(): Promise<boolean> {
      try {
        await this.fetchUser();
        this.csrfFetched = true;
        return true;
      } catch {
        this.clearState();
        return false;
      }
    },

    clearState() {
      // this.$patch({
      //   username: null,
      //   supportedTeam: { id: null, name: null, logo_url: null },
      //   csrfFetched: false,
      //   roles: [],
      // });
    },
  },
});
