<template>
  <q-page class="flex flex-center">
    <q-card class="auth-card">
      <q-card-section class="text-center">
        <h4 class="text-h4 q-mb-md">Login</h4>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleLogin" class="q-gutter-md">
          <q-input
            v-model="form.username"
            label="Username"
            outlined
            :rules="[val => !!val || 'Username is required']"
            :disable="authStore.isLoading"
          />

          <q-input
            v-model="form.password"
            label="Password"
            type="password"
            outlined
            :rules="[val => !!val || 'Password is required']"
            :disable="authStore.isLoading"
          />

          <div v-if="authStore.error" class="text-negative text-center q-mb-md">
            {{ authStore.error }}
          </div>

          <q-btn
            type="submit"
            label="Login"
            color="primary"
            class="full-width"
            :loading="authStore.isLoading"
            :disable="authStore.isLoading"
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center">
        <p class="q-mb-sm">
          Don't have an account?
          <router-link to="/auth/register" class="text-primary">Register here</router-link>
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/auth-store';
import { Notifier } from 'src/utils/notifier';
import type { LoginCredentials } from 'src/types/user';

const router = useRouter();
const authStore = useAuthStore();

const form = ref<LoginCredentials>({
  username: '',
  password: '',
});

const handleLogin = async () => {
  try {
    await authStore.login(form.value);

    Notifier.quickPositive('auth.login.success');

    // Redirect to home page or intended destination
    await router.push('/');
  } catch (error) {
    // Error is already handled in the store
    console.error('Login error:', error);
  }
};
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
</style>
