<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card>
          <q-card-section class="text-center">
            <h4 class="text-h4 q-mb-md">Profile Settings</h4>
          </q-card-section>

          <q-card-section>
            <q-tabs
              v-model="activeTab"
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="profile" label="Profile" />
              <q-tab name="password" label="Password" />
              <q-tab name="danger" label="Danger Zone" />
            </q-tabs>

            <q-tab-panels v-model="activeTab" animated>
              <!-- Profile Tab -->
              <q-tab-panel name="profile">
                                  <q-form @submit="handleUpdateProfileSubmit" class="q-gutter-md">
                  <q-input
                    v-model="profileForm.username"
                    label="Username"
                    outlined
                    :rules="[
                      val => !!val || 'Username is required',
                      val => val.length >= 3 || 'Username must be at least 3 characters',
                      val => /^[a-zA-Z0-9_]+$/.test(val) || 'Username can only contain letters, numbers, and underscores'
                    ]"
                    :disable="userStore.isLoading"
                  />

                  <q-input
                    v-model="profileForm.bio"
                    label="Bio"
                    type="textarea"
                    outlined
                    :rules="[
                      val => !val || val.length <= 1000 || 'Bio must be 1000 characters or less'
                    ]"
                    :disable="userStore.isLoading"
                  />

                  <q-input
                    v-model="profileForm.website"
                    label="Website"
                    type="url"
                    outlined
                    :rules="[
                      val => !val || /^https?:\/\/.+/.test(val) || 'Please enter a valid URL'
                    ]"
                    :disable="userStore.isLoading"
                  />

                  <div class="text-h6 q-mb-sm">Social Links</div>

                  <div class="row q-gutter-md">
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="profileForm.social_links.twitter"
                        label="Twitter"
                        outlined
                        :disable="userStore.isLoading"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="profileForm.social_links.facebook"
                        label="Facebook"
                        outlined
                        :disable="userStore.isLoading"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="profileForm.social_links.instagram"
                        label="Instagram"
                        outlined
                        :disable="userStore.isLoading"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="profileForm.social_links.youtube"
                        label="YouTube"
                        outlined
                        :disable="userStore.isLoading"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="profileForm.social_links.linkedin"
                        label="LinkedIn"
                        outlined
                        :disable="userStore.isLoading"
                      />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model="profileForm.social_links.github"
                        label="GitHub"
                        outlined
                        :disable="userStore.isLoading"
                      />
                    </div>
                  </div>

                  <div v-if="userStore.error" class="text-negative text-center q-mb-md">
                    {{ userStore.error }}
                  </div>

                  <div v-if="userStore.hasSuccess" class="text-positive text-center q-mb-md">
                    {{ userStore.successMessage }}
                  </div>

                  <q-btn
                    type="submit"
                    label="Update Profile"
                    color="primary"
                    :loading="userStore.isLoading"
                    :disable="userStore.isLoading"
                  />
                </q-form>
              </q-tab-panel>

              <!-- Password Tab -->
              <q-tab-panel name="password">
                <q-form @submit="handleUpdatePasswordSubmit" class="q-gutter-md">
                  <q-input
                    v-model="passwordForm.current_password"
                    label="Current Password"
                    type="password"
                    outlined
                    :rules="[val => !!val || 'Current password is required']"
                    :disable="userStore.isLoading"
                  />

                  <q-input
                    v-model="passwordForm.password"
                    label="New Password"
                    type="password"
                    outlined
                    :rules="[
                      val => !!val || 'New password is required',
                      val => val.length >= 8 || 'Password must be at least 8 characters'
                    ]"
                    :disable="userStore.isLoading"
                  />

                  <q-input
                    v-model="passwordForm.password_confirmation"
                    label="Confirm New Password"
                    type="password"
                    outlined
                    :rules="[
                      val => !!val || 'Please confirm your new password',
                      val => val === passwordForm.password || 'Passwords do not match'
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
            :rules="[val => !!val || 'Password is required']"
            :disable="userStore.isLoading"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Delete Account"
            color="negative"
            @click="handleDeleteAccountClick"
            :loading="userStore.isLoading"
            :disable="userStore.isLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { useUserStore } from 'src/stores/user-store';
import { Notifier } from 'src/utils/notifier';
import type { UpdateProfileData, UpdatePasswordData } from "src/types/user";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const activeTab = ref('profile');
const showDeleteDialog = ref(false);
const deletePassword = ref('');

// Initialize profile form with current user data
const profileForm = ref<UpdateProfileData>({
  username: '',
  bio: '',
  website: '',
  social_links: {
    twitter: '',
    facebook: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    linkedin: '',
    github: '',
  },
});

const passwordForm = ref<UpdatePasswordData>({
  current_password: '',
  password: '',
  password_confirmation: '',
});

// Load current user data
onMounted(async () => {
  console.log('ProfilePage mounted, authStore.user:', authStore.user);

  // Ensure user data is loaded
  if (!authStore.user) {
    console.log('No user data, fetching...');
    await authStore.fetchUser();
    console.log('After fetchUser, authStore.user:', authStore.user);
  }

  if (authStore.user) {
    profileForm.value.username = authStore.user.username;
    if (authStore.user.profile) {
      profileForm.value.bio = authStore.user.profile.bio || '';
      profileForm.value.website = authStore.user.profile.website || '';
      if (authStore.user.profile.social_links) {
        profileForm.value.social_links = {
          ...profileForm.value.social_links,
          ...authStore.user.profile.social_links,
        };
      }
    }
  }
});

const handleUpdateProfile = async () => {
  try {
    console.log('Submitting profile update:', profileForm.value);

    await userStore.updateProfile(profileForm.value);

    console.log('Profile updated, current auth user:', authStore.user);

    // Refresh the form with updated user data
    if (authStore.user) {
      profileForm.value.username = authStore.user.username;
      if (authStore.user.profile) {
        profileForm.value.bio = authStore.user.profile.bio || '';
        profileForm.value.website = authStore.user.profile.website || '';
        if (authStore.user.profile.social_links) {
          profileForm.value.social_links = {
            ...profileForm.value.social_links,
            ...authStore.user.profile.social_links,
          };
        }
      }
    }

    console.log('Form refreshed with:', profileForm.value);

    Notifier.quickPositive('profile.update.success');
  } catch (error) {
    console.error('Profile update error:', error);
  }
};

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
    await router.push('/');
  } catch (error) {
    console.error('Account deletion error:', error);
  } finally {
    showDeleteDialog.value = false;
    deletePassword.value = '';
  }
};

// Wrapper functions to handle Promise warnings in template
const handleUpdateProfileSubmit = () => {
  void handleUpdateProfile();
};

const handleUpdatePasswordSubmit = () => {
  void handleUpdatePassword();
};

const handleDeleteAccountClick = () => {
  void handleDeleteAccount();
};
</script>
