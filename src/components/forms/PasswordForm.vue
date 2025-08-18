<template>
  <q-form
    autocorrect="off"
    autocapitalize="off"
    class="q-ma-md"
    greedy
    ref="passwordForm"
    spellcheck="false"
    @submit="handleUpdatePassword"
  >
    <q-input
      v-model="formData.current_password"
      :disable="userStore.isLoading"
      :label="$t('labels.currentPassword')"
      :type="showPassword.current ? 'text' : 'password'"
      outlined
      :rules="[(val) => !!val || $t('errors.valueRequired')]"
    >
      <template v-slot:append>
        <TogglePassword v-model="showPassword.current" />
      </template>
    </q-input>

    <q-input
      v-model="formData.password"
      :label="$t('labels.newPassword')"
      :type="showPassword.new ? 'text' : 'password'"
      outlined
      lazy-rules
      :rules="[
        (val) => !!val || $t('errors.valueRequired'),
        (val) => val.length >= 8 || 'Password must be at least 8 characters',
      ]"
      :disable="userStore.isLoading"
    >
      <template v-slot:append>
        <TogglePassword v-model="showPassword.new" />
      </template>
    </q-input>
    <q-input
      v-model="formData.password_confirmation"
      :label="$t('labels.confirmPassword')"
      :type="showPassword.confirm ? 'text' : 'password'"
      outlined
      :rules="[
        (val) => !!val || 'Please confirm your new password',
        (val) => val === formData.password || 'Passwords do not match',
      ]"
      :disable="userStore.isLoading"
    >
      <template v-slot:append>
        <TogglePassword v-model="showPassword.confirm" />
      </template>
    </q-input>
    <div v-if="userStore.error" class="text-negative text-center q-mb-md">
      {{ userStore.error }}
    </div>

    <div v-if="userStore.hasSuccess" class="text-positive text-center q-mb-md">
      {{ userStore.successMessage }}
    </div>

    <q-btn
      color="primary"
      :disable="userStore.isLoading"
      label="Update Password"
      :loading="userStore.isLoading"
      no-caps
      type="submit"
    />
  </q-form>
</template>
<script setup lang="ts">
import TogglePassword from 'components/TogglePassword.vue';
import { QForm } from 'quasar';
import type { UpdatePasswordData } from 'src/types/user';
import { Notifier } from 'src/utils/Notifier';
import { useUserStore } from 'stores/user-store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
/* ============ PROPS ============ */

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

const userStore = useUserStore();
const router = useRouter();

/* ============= REFS ============ */

const passwordForm = ref<QForm | null>(null);
const formData = ref<UpdatePasswordData>({
  current_password: '',
  password: '',
  password_confirmation: '',
});
const showPassword = ref({
  current: false,
  new: false,
  confirm: false,
});

/* ============ HOOKS ============ */

/* =========== METHODS =========== */

const handleUpdatePassword = async () => {
  if (passwordForm.value === null) {
    return;
  }

  passwordForm.value?.resetValidation();
  const isValid = await passwordForm.value?.validate();
  if (!isValid) {
    return;
  }

  try {
    await userStore.updatePassword(formData.value);

    Notifier.quickPositive('profile.password.success');

    // Clear password form
    formData.value.current_password = '';
    formData.value.password = '';
    formData.value.password_confirmation = '';
    await router.push({ name: 'home' });
  } catch (error) {
    console.error('Password update error:', error);
  }
};
</script>

<style scoped lang="scss"></style>
