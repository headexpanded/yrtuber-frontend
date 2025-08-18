<template>
  <q-page class="flex flex-center">
    <q-card class="auth-card">
      <q-card-section class="text-center">
        <h4 class="text-h4 q-mb-md">{{$t('labels.login')}}</h4>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleLogin" class="q-gutter-md">
          <q-input
            v-model="form.username"
            :label="$t('labels.username')"
            outlined
            lazy-rules
            :rules="[val => !!val || 'Username is required']"
            :disable="authStore.isLoading"
          />

          <q-input
            v-model="form.password"
            :label="$t('labels.password')"
            type="password"
            outlined
            lazy-rules
            :rules="[val => !!val || 'Password is required']"
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
          {{$t('labels.noAccount')}}
          <router-link to="/auth/register" class="text-primary">{{$t('labels.registerHere')}}</router-link>
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
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
    await router.push('/');
  } catch (error) {
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
