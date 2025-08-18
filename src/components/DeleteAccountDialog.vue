<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="negative" text-color="white" />
        <span class="q-ml-sm">{{ $t('labels.deleteAccount') }}</span>
      </q-card-section>

      <q-card-section>
        <p>{{ $t('labels.confirmDeleteAccount') }}</p>
        <q-input
          v-model="deletePassword"
          :disable="userStore.isLoading"
          :label="$t('labels.password')"
          lazy-rules
          outlined
          :rules="[(val) => !!val || $t('errors.valueRequired')]"
          :type="showPassword ? 'text' : 'password'"
        >
          <template v-slot:append>
            <TogglePassword v-model="showPassword" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('labels.cancel')" color="primary" v-close-popup />
        <q-btn
          color="negative"
          :disable="userStore.isLoading"
          flat
          :label="$t('labels.deleteAccount')"
          :loading="userStore.isLoading"
          @click="handleDeleteAccount"
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
const deletePassword = ref<string>('');

/* ============ HOOKS ============ */

/* =========== METHODS =========== */

const handleDeleteAccount = async () => {
  try {
    await userStore.deleteAccount(deletePassword.value);

    Notifier.quickPositive('label.accountDeleted');
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
