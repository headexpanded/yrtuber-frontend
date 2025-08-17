import { defineStore } from 'pinia';
import { UserApiService } from 'src/services/userApi';
import type { UpdateProfileData, UpdatePasswordData } from 'src/types/user';

type State = {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
};

type Getters = {
  hasError: (state: State) => boolean;
  hasSuccess: (state: State) => boolean;
};

type Actions = {
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  updatePassword: (data: UpdatePasswordData) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  clearMessages: () => void;
};

const defaultState: State = {
  isLoading: false,
  error: null,
  successMessage: null,
};

export const useUserStore = defineStore<'user', State, Getters, Actions>('user', {
  state: () => ({ ...defaultState }),

  getters: {
    hasError: (state) => !!state.error,
    hasSuccess: (state) => !!state.successMessage,
  },

  actions: {
    async updateProfile(data: UpdateProfileData) {
      this.isLoading = true;
      this.error = null;
      this.successMessage = null;

      try {
        const updatedUser = await UserApiService.updateProfile(data);

        // Update the user in the auth store
        const { useAuthStore } = await import('./auth-store');
        const authStore = useAuthStore();
        authStore.user = updatedUser;

        this.successMessage = 'Profile updated successfully';
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to update profile';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updatePassword(data: UpdatePasswordData) {
      this.isLoading = true;
      this.error = null;
      this.successMessage = null;

      try {
        const response = await UserApiService.updatePassword(data);
        this.successMessage = response.message;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to update password';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteAccount(password: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await UserApiService.deleteAccount(password);

        // Clear auth store after account deletion
        const { useAuthStore } = await import('./auth-store');
        const authStore = useAuthStore();
        authStore.clearState();

        this.successMessage = response.message;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to delete account';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    clearError() {
      this.error = null;
    },

    clearSuccess() {
      this.successMessage = null;
    },

    clearMessages() {
      this.error = null;
      this.successMessage = null;
    },
  },
});
