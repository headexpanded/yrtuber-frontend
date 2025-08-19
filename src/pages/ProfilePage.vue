<template>
  <q-page class="q-pa-md">
    <h4 class="q-mt-none q-mb-sm">{{ username }}</h4>
    <q-btn class="text-body2 text-grey-7 q-pl-none" dense flat no-caps :ripple="false">Start a collection</q-btn>
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card>
          <q-card-section class="text-center">{{ $t('labels.profileSettings') }}</q-card-section>
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
              <q-tab name="password" :label="$t('passwords.password')" />
              <q-tab name="danger" :label="$t('labels.dangerZone')" />
            </q-tabs>
            <q-tab-panels v-model="activeTab" animated>
              <!-- Profile Tab -->
              <q-tab-panel name="profile">
                <ProfileForm />
              </q-tab-panel>
              <!-- Password Tab -->
              <q-tab-panel name="password">
                <PasswordForm />
              </q-tab-panel>
              <!-- Danger Zone Tab -->
              <q-tab-panel name="danger">
                <div class="text-center q-pa-md">
                  <q-icon name="warning" color="negative" size="4rem" />
                  <h6 class="text-h6 q-mt-md q-mb-sm">{{ $t('labels.dangerZone') }}</h6>
                  <p class="text-grey q-mb-lg">
                    {{ $t('labels.deletePasswordWarning') }}
                  </p>
                  <q-btn
                    color="negative"
                    :disable="userStore.isLoading"
                    :label="$t('labels.deleteAccount')"
                    no-caps
                    @click="showDeleteDialog = true"
                  />
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <DeleteAccountDialog v-model="showDeleteDialog" />
    >
  </q-page>
</template>

<script setup lang="ts">
import DeleteAccountDialog from 'components/DeleteAccountDialog.vue';
import PasswordForm from 'components/forms/PasswordForm.vue';
import ProfileForm from 'components/forms/ProfileForm.vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useUserStore } from 'src/stores/user-store';
import { onMounted, ref } from 'vue';

/* ========= LOCAL SCOPE ========= */

const authStore = useAuthStore();
const userStore = useUserStore();

/* ============= REFS ============ */

const activeTab = ref('profile');
const showDeleteDialog = ref(false);
const username = ref('');

/* ============ HOOKS ============ */

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUser();
  }

  if (authStore.user) {
    username.value = authStore.user.username;
    // if (authStore.user.profile) {
    //   formData.value.bio = authStore.user.profile.bio || '';
    //   formData.value.website = authStore.user.profile.website || '';
    //   if (authStore.user.profile.social_links) {
    //     formData.value.social_links = {
    //       ...formData.value.social_links,
    //       ...authStore.user.profile.social_links,
    //     };
    //   }
    // }
  }
});
</script>
