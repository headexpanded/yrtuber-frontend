<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="negative" text-color="white" />
        <span class="q-ml-sm">Delete Account</span>
      </q-card-section>

      <q-card-section>
        <p>This action cannot be undone. Please enter your password to confirm.</p>
        <q-input
          v-model="deletePassword"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          outlined
          :rules="[(val) => !!val || 'Password is required']"
          :disable="userStore.isLoading"
        >
          <template v-slot:append>
            <TogglePassword v-model="showPassword" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          flat
          label="Delete Account"
          color="negative"
          @click="handleDeleteAccount"
          :loading="userStore.isLoading"
          :disable="userStore.isLoading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import TogglePassword from 'components/TogglePassword.vue';
import { Notifier } from 'src/utils/Notifier';
import { useUserStore } from 'stores/user-store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

/* ============ PROPS ============ */

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

const userStore = useUserStore();
const router = useRouter();

const modelValue = defineModel<boolean>({
  type: Boolean,
  required: true,
});

/* ============= REFS ============ */

const showPassword = ref<boolean>(false);
const deletePassword = ref('');

/* ============ HOOKS ============ */

/* =========== METHODS =========== */

const handleDeleteAccount = async () => {
  try {
    await userStore.deleteAccount(deletePassword.value);

    Notifier.quickPositive('profile.delete.success');
    modelValue.value = !modelValue.value;
    // Redirect to home page
    await router.push({ name: 'home' });
  } catch (error) {
    console.error('Account deletion error:', error);
  } finally {
    deletePassword.value = '';
  }
};
</script>

<style scoped lang="scss"></style>
