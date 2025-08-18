<template>
  <q-form
    autocorrect="off"
    autocapitalize="off"
    class="q-ma-md"
    greedy
    ref="profileForm"
    spellcheck="false"
    @submit="handleUpdateProfile"
  >
    <q-input
      v-model="formData.username"
      :disable="userStore.isLoading"
      :label="$t('labels.username')"
      lazy-rules
      outlined
      :rules="[
        (val) => !!val || $t('errors.valueRequired'),
        (val) => val.length >= 3 || $t('errors.usernameTooShort'),
        (val) =>
          /^[a-zA-Z0-9_]+$/.test(val) ||
          'Username can only contain letters, numbers, and underscores',
      ]"
    />

    <q-input
      v-model="formData.bio"
      counter
      :disable="userStore.isLoading"
      :label="$t('labels.bio')"
      lazy-rules
      maxlength="1000"
      outlined
      :rules="[(val) => !val || val.length <= 1000 || 'Bio must be 1000 characters or less']"
      type="textarea"
    />

    <q-input
      v-model="formData.website"
      :disable="userStore.isLoading"
      :label="$t('labels.website')"
      lazy-rules
      outlined
      :rules="[(val) => !val || /^https?:\/\/.+/.test(val) || 'Please enter a valid URL']"
      type="url"
    />

    <div class="text-h6 q-mb-sm">{{$t('labels.socialLinks')}}</div>

    <div class="row q-gutter-md">
      <div class="col-12 col-sm-6">
        <q-input
          v-model="formData.social_links.twitter"
          label="Twitter"
          outlined
          :disable="userStore.isLoading"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-input
          v-model="formData.social_links.facebook"
          label="Facebook"
          outlined
          :disable="userStore.isLoading"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-input
          v-model="formData.social_links.instagram"
          label="Instagram"
          outlined
          :disable="userStore.isLoading"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-input
          v-model="formData.social_links.youtube"
          label="YouTube"
          outlined
          :disable="userStore.isLoading"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-input
          v-model="formData.social_links.linkedin"
          label="LinkedIn"
          outlined
          :disable="userStore.isLoading"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-input
          v-model="formData.social_links.github"
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
      color="primary"
      :disable="userStore.isLoading"
      :label="$t('labels.updateProfile')"
      :loading="userStore.isLoading"
      no-caps
      type="submit"
    />
  </q-form>
</template>
<script setup lang="ts">
import { QForm } from 'quasar';
import type { UpdateProfileData } from 'src/types/user';
import { Notifier } from 'src/utils/Notifier';
import { useAuthStore } from 'stores/auth-store';
import { useUserStore } from 'stores/user-store';
import { onMounted, ref } from 'vue';

/* ============ PROPS ============ */

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

const authStore = useAuthStore();
const userStore = useUserStore();

/* ============= REFS ============ */

const profileForm = ref<QForm | null>(null);
const formData = ref<UpdateProfileData>({
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

/* ============ HOOKS ============ */

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUser();
  }

  if (authStore.user) {
    formData.value.username = authStore.user.username;
    if (authStore.user.profile) {
      formData.value.bio = authStore.user.profile.bio || '';
      formData.value.website = authStore.user.profile.website || '';
      if (authStore.user.profile.social_links) {
        formData.value.social_links = {
          ...formData.value.social_links,
          ...authStore.user.profile.social_links,
        };
      }
    }
  }
});

/* =========== METHODS =========== */

const handleUpdateProfile = async () => {
  if (profileForm.value === null) {
    return;
  }

  profileForm.value?.resetValidation();
  const isValid = await profileForm.value?.validate();
  if (!isValid) {
    return;
  }

  try {
    await userStore.updateProfile(formData.value);
    if (authStore.user) {
      formData.value.username = authStore.user.username;
      if (authStore.user.profile) {
        formData.value.bio = authStore.user.profile.bio || '';
        formData.value.website = authStore.user.profile.website || '';
        if (authStore.user.profile.social_links) {
          formData.value.social_links = {
            ...formData.value.social_links,
            ...authStore.user.profile.social_links,
          };
        }
      }
    }

    Notifier.quickPositive('labels.profileUpdated');
  } catch (error) {
    console.error('Profile update error:', error);
  }
};
</script>

<style scoped lang="scss"></style>
