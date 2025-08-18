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
          :label="$t('labels.username')"
          outlined
          lazy-rules
          :rules="[(val) => !!val || 'Username is required']"
          :disable="authStore.isLoading"
        />

        <q-input
          v-model="formData.password"
          :label="$t('labels.password')"
          type="password"
          outlined
          lazy-rules
          :rules="[(val) => !!val || 'Password is required']"
          :disable="authStore.isLoading"
        />

        <div v-if="authStore.error" class="text-negative text-center q-mb-md">
          {{ authStore.error }}
        </div>

        <q-btn
          type="submit"
          :label="$t('labels.login')"
          no-caps
          color="primary"
          class="full-width"
          :loading="authStore.isLoading"
          :disable="authStore.isLoading"
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
import { useAuthStore } from 'stores/auth-store';
import type { LoginCredentials } from 'src/types/user';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
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
  if (loginForm === null) {
    return;
  }

  loginForm.value?.resetValidation();
  const isValid = await loginForm.value?.validate();
  if (!isValid) {
    return;
  }

  try {
    await authStore.login(formData.value);
    await router.push('/');
  } catch (error) {
    console.error('Login error:', error);
  }
};
</script>

<style scoped>

</style>
