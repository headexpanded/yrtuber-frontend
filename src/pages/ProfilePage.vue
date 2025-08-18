<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card>
          <q-card-section class="text-center">
            <h4 class="text-h4 q-mb-md">{{ $t('labels.profileSettings') }}</h4>
          </q-card-section>
          <q-card-section>
            <q-tabs
              v-model="activeTab"
              align="justify"
              active-color="primary"
              class="text-grey"
              indicator-color="primary"
              narrow-indicator
            >
              <q-tab name="profile" :label="$t('labels.profile')" />
              <q-tab name="password" :label="$t('labels.password')" />
              <q-tab name="danger" :label="$t('labels.dangerZone')" />
            </q-tabs>

            <q-tab-panels v-model="activeTab" animated>
              <!-- Profile Tab -->
              <q-tab-panel name="profile">
                <ProfileForm />
              </q-tab-panel>
              <!-- Password Tab -->
              <q-tab-panel name="password">
                <q-form @submit="handleUpdatePassword" class="q-gutter-md">
                  <q-input
                    v-model="passwordForm.current_password"
                    :label="$t('labels.currentPassword')"
                    type="password"
                    outlined
                    :rules="[(val) => !!val || 'Current password is required']"
                    :disable="userStore.isLoading"
                  />

                  <q-input
                    v-model="passwordForm.password"
                    :label="$t('labels.newPassword')"
                    type="password"
                    outlined
                    lazy-rules
                    :rules="[
                      (val) => !!val || 'New password is required',
                      (val) => val.length >= 8 || 'Password must be at least 8 characters',
                    ]"
                    :disable="userStore.isLoading"
                  />

                  <q-input
                    v-model="passwordForm.password_confirmation"
                    :label="$t('labels.confirmNewPassword')"
                    type="password"
                    outlined
                    :rules="[
                      (val) => !!val || 'Please confirm your new password',
                      (val) => val === passwordForm.password || 'Passwords do not match',
                    ]"
                    :disable="userStore.isLoading"
                  />

                  <div v-if="userStore.error" class="text-negative text-center q-mb-md">
                    {{ userStore.error }}
                  </div>

                  <div v-if="userStore.hasSuccess" class="text-positive text-center q-mb-md">
                    {{ userStore.successMessage }}
                  </div>

                  <q-btn
                    type="submit"
                    label="Update Password"
                    color="primary"
                    :loading="userStore.isLoading"
                    :disable="userStore.isLoading"
                  />
                </q-form>
              </q-tab-panel>

              <!-- Danger Zone Tab -->
              <q-tab-panel name="danger">
                <div class="text-center q-pa-md">
                  <q-icon name="warning" color="negative" size="4rem" />
                  <h6 class="text-h6 q-mt-md q-mb-sm">Danger Zone</h6>
                  <p class="text-grey q-mb-lg">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>

                  <q-btn
                    label="Delete Account"
                    color="negative"
                    @click="showDeleteDialog = true"
                    :disable="userStore.isLoading"
                  />
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Delete Account Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
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
            type="password"
            outlined
            :rules="[(val) => !!val || 'Password is required']"
            :disable="userStore.isLoading"
          />
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
  </q-page>
</template>

<script setup lang="ts">
import ProfileForm from 'components/forms/ProfileForm.vue';
import { useUserStore } from 'src/stores/user-store';
import type { UpdatePasswordData } from 'src/types/user';
import { Notifier } from 'src/utils/Notifier';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const activeTab = ref('profile');
const showDeleteDialog = ref(false);
const deletePassword = ref('');

const passwordForm = ref<UpdatePasswordData>({
  current_password: '',
  password: '',
  password_confirmation: ''
});

const handleUpdatePassword = async () => {
  try {
    await userStore.updatePassword(passwordForm.value);

    Notifier.quickPositive('profile.password.success');

    // Clear password form
    passwordForm.value.current_password = '';
    passwordForm.value.password = '';
    passwordForm.value.password_confirmation = '';
  } catch (error) {
    console.error('Password update error:', error);
  }
};

const handleDeleteAccount = async () => {
  try {
    await userStore.deleteAccount(deletePassword.value);

    Notifier.quickPositive('profile.delete.success');

    // Redirect to home page
    await router.push({ name: 'home' });
  } catch (error) {
    console.error('Account deletion error:', error);
  } finally {
    showDeleteDialog.value = false;
    deletePassword.value = '';
  }
};
</script>
