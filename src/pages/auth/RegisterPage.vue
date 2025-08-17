  <template>
  <q-page class="flex flex-center">
    <q-card class="auth-card">
      <q-card-section class="text-center">
        <h4 class="text-h4 q-mb-md">Create Account</h4>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleRegister" class="q-gutter-md">
          <q-input
            v-model="form.username"
            label="Username"
            outlined
            :rules="[
              val => !!val || 'Username is required',
              val => val.length >= 3 || 'Username must be at least 3 characters',
              val => /^[a-zA-Z0-9_]+$/.test(val) || 'Username can only contain letters, numbers, and underscores'
            ]"
            :disable="authStore.isLoading"
          />

          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined
            :rules="[
              val => !!val || 'Email is required',
              val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email'
            ]"
            :disable="authStore.isLoading"
          />

          <q-input
            v-model="form.password"
            label="Password"
            type="password"
            outlined
            :rules="[
              val => !!val || 'Password is required',
              val => val.length >= 8 || 'Password must be at least 8 characters'
            ]"
            :disable="authStore.isLoading"
          />

          <q-input
            v-model="form.password_confirmation"
            label="Confirm Password"
            type="password"
            outlined
            :rules="[
              val => !!val || 'Please confirm your password',
              val => val === form.password || 'Passwords do not match'
            ]"
            :disable="authStore.isLoading"
          />

          <div v-if="authStore.error" class="text-negative text-center q-mb-md">
            {{ authStore.error }}
          </div>

          <q-btn
            type="submit"
            label="Create Account"
            color="primary"
            class="full-width"
            :loading="authStore.isLoading"
            :disable="authStore.isLoading"
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center">
        <p class="q-mb-sm">
          Already have an account?
          <router-link to="/auth/login" class="text-primary">Login here</router-link>
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
import type { RegisterCredentials } from 'src/types/user';

const router = useRouter();
const authStore = useAuthStore();

const form = ref<RegisterCredentials>({
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const handleRegister = async () => {
  try {
    await authStore.register(form.value);

    Notifier.quickPositive('auth.register.success');

    // Redirect to home page or intended destination
    await router.push('/');
  } catch (error) {
    // Error is already handled in the store
    console.error('Registration error:', error);
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
