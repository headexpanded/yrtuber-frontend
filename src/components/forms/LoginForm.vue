<template>
  <q-card>
    <q-card-section class="text-h6 text-center">{{ $t('labels.login') }}</q-card-section>
    <q-card-section>
      <q-form
        autocorrect="off"
        autocapitalize="off"
        class="q-ma-md"
        greedy
        ref="loginForm"
        spellcheck="false"
        @submit="handleLogin"
      >
        <q-input
          v-model="formData.username"
          :disable="authStore.isLoading"
          :label="$t('labels.username')"
          lazy-rules
          outlined
          :rules="[(val) => !!val || $t('errors.valueRequired')]"
        />

        <q-input
          v-model="formData.password"
          :disable="authStore.isLoading"
          :label="$t('labels.password')"
          lazy-rules
          outlined
          :rules="[(val) => !!val || 'Password is required']"
          type="password"
        />

        <div v-if="authStore.error" class="text-negative text-center q-mb-md">
          {{ authStore.error }}
        </div>

        <q-btn
          class="q-mt-md full-width"
          color="primary"
          :disable="authStore.isLoading"
          :label="$t('labels.login')"
          :loading="authStore.isLoading"
          no-caps
          type="submit"
        />
      </q-form>
    </q-card-section>

    <q-card-section class="text-center">
      <p class="q-mb-sm">
        {{ $t('labels.noAccount') }}
        <router-link to="/auth/register" class="text-primary"
          >{{ $t('labels.registerHere') }}
        </router-link>
      </p>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">

import { QForm } from 'quasar';
import type { LoginCredentials } from 'src/types/user';
import { useAuthStore } from 'stores/auth-store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
/* ============ PROPS ============ */

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

const authStore = useAuthStore();
const router = useRouter();

/* ============= REFS ============ */

const loginForm = ref<QForm | null>(null);
const formData = ref<LoginCredentials>({
  username: '',
  password: '',
});

/* ============ HOOKS ============ */

/* =========== METHODS =========== */

const handleLogin = async () => {
  if (loginForm.value === null) {
    return;
  }

  loginForm.value?.resetValidation();
  const isValid = await loginForm.value?.validate();
  if (!isValid) {
    return;
  }

  try {
    await authStore.login(formData.value);
    await router.push({ name: "home" });
  } catch (error) {
    console.error('Login error:', error);
  }
};
</script>

<style scoped lang="scss">
.q-card {
  max-width: 800px;
  margin: auto;
  width: 800px;
}
</style>
