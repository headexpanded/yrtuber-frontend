<template>
  <q-card class="auth-card">
    <q-card-section class="text-center"> {{ $t('labels.createAccount') }}</q-card-section>
    <q-card-section>
      <q-form
        autocorrect="off"
        autocapitalize="off"
        class="q-ma-md"
        greedy
        spellcheck="false"
        ref="registerForm"
        @submit="handleRegister"
      >
        <q-input
          v-model="formData.username"
          :disable="authStore.isLoading"
          :label="$t('labels.username')"
          lazy-rules
          outlined
          :rules="[
            (val) => !!val || 'Username is required',
            (val) => val.length >= 3 || 'Username must be at least 3 characters',
            (val) =>
              /^[a-zA-Z0-9_]+$/.test(val) ||
              'Username can only contain letters, numbers, and underscores',
          ]"
        />

        <q-input
          v-model="formData.email"
          :disable="authStore.isLoading"
          :label="$t('labels.email')"
          lazy-rules
          outlined
          :rules="[
            (val) => !!val || 'Email is required',
            (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email',
          ]"
          type="email"
        />

        <q-input
          v-model="formData.password"
          :disable="authStore.isLoading"
          :label="$t('passwords.password')"
          lazy-rules
          outlined
          :rules="[
            (val) => !!val || 'Password is required',
            (val) => val.length >= 8 || 'Password must be at least 8 characters',
          ]"
          type="password"
        />

        <q-input
          v-model="formData.password_confirmation"
          :disable="authStore.isLoading"
          :label="$t('passwords.confirmPassword')"
          lazy-rules
          outlined
          :rules="[
            (val) => !!val || 'Please confirm your password',
            (val) => val === formData.password || $t('passwords.passwordsDoNotMatch'),
          ]"
          type="password"
        />

        <div v-if="authStore.error" class="text-negative text-center q-mb-md">
          {{ authStore.error }}
        </div>

        <q-btn
          class="full-width"
          color="primary"
          :disable="authStore.isLoading"
          :label="$t('labels.createAccount')"
          :loading="authStore.isLoading"
          no-caps
          type="submit"
        />
      </q-form>
    </q-card-section>

    <q-card-section class="text-center">
      <p class="q-mb-sm">
        {{ $t('labels.alreadyHaveAccount') }}
        <router-link to="/auth/login" class="text-primary">{{ $t('labels.login') }}</router-link>
      </p>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { QForm } from 'quasar';
import type { RegisterCredentials } from 'src/types/user';
import { useAuthStore } from 'stores/auth-store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

/* ============ PROPS ============ */

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */
const authStore = useAuthStore();
const router = useRouter();

/* ============= REFS ============ */
const registerForm = ref<QForm | null>(null);
const formData = ref<RegisterCredentials>({
  username: '',
  email: '',
  password: '',
  password_confirmation: ''
});
/* ============ HOOKS ============ */

/* =========== METHODS =========== */
const handleRegister = async () => {
  if (registerForm.value === null) {
    return;
  }

  registerForm.value?.resetValidation();
  const isValid = await registerForm.value?.validate();
  if (!isValid) {
    return;
  }

  try {
    await authStore.register(formData.value);
    await router.push({ name: 'home' });
  } catch (error) {
    // Error is already handled in the store
    console.error('Registration error:', error);
  }
};
</script>

<style scoped lang="scss"></style>
