<template>
  <q-page padding>
    <div class="column">
      <h4 class="q-my-none text-weight-bold">{{ userProfile.username }}</h4>
      <div>{{ userProfile.bio }}</div>
      <div class="column q-mb-xl q-py-md">
        <q-btn
          class="text-body2 text-grey-7 fit-content"
          flat
          no-caps
          rounded
          @click="openCreateForm"
        >
          {{ $t('labels.createCollection') }}
        </q-btn>
        <div class="q-pl-md text-body2 text-grey-7">{{ $t('labels.myCollections') }}</div>
      </div>
      <div class="row q-col-gutter-x-xs q-col-gutter-y-xl">
        <CollectionCard
          v-for="collection in collections"
          :key="collection.id"
          :item="collection"
          class="col-xs-12 col-sm-6 col-md-4"
        />
      </div>
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
    </div>
    <DeleteAccountDialog v-model="showDeleteDialog" />
    >
  </q-page>
  <CreateCollectionForm v-model="createFormOpen" @collection-created="getMyCollections" />
</template>

<script setup lang="ts">
import { api } from 'boot/axios';
import CollectionCard from 'components/CollectionCard.vue';
import DeleteAccountDialog from 'components/DeleteAccountDialog.vue';
import CreateCollectionForm from 'components/forms/CreateCollectionForm.vue';
import PasswordForm from 'components/forms/PasswordForm.vue';
import ProfileForm from 'components/forms/ProfileForm.vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useUserStore } from 'src/stores/user-store';
import { type Collection } from 'src/types/Collection';
import { type UserProfile } from 'src/types/User';
import { onMounted, ref } from 'vue';

/* ========= LOCAL SCOPE ========= */

const authStore = useAuthStore();
const userStore = useUserStore();

/* ============= REFS ============ */

const activeTab = ref('profile');
const showDeleteDialog = ref(false);
const username = ref('');
const userProfile = ref<Omit<UserProfile, 'id' | 'user_id'>>({
  bio: '',
  website: '',
  username: '',
  social_links: {
    twitter: '',
    github: '',
    linkedin: '',
    instagram: '',
  },
  created_at: '',
  updated_at: '',
});
const collections = ref<Collection[]>([]);
const createFormOpen = ref(false);
const openCreateForm = () => {
  createFormOpen.value = true;
};

/* ============ HOOKS ============ */

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUser();
  }

  if (authStore.user) {
    username.value = authStore.user.username;
    if (authStore.user.profile) {
      userProfile.value = {
        ...authStore.user.profile,
      };
    }
    await getMyCollections();
  }
});

/* =========== METHODS =========== */

const getMyCollections = async () => {
  const apiUrl = 'api/my-collections';
  const params = {
    withCredentials: true,
  };
  await api
    .get(apiUrl, params)
    .then((response) => {
      console.log('My collections profile page:', response.data.data);
      collections.value = response.data.data;
    })
    .catch((error) => {
      console.error('Error fetching my collections:', error);
    });
};
</script>

<style scoped lang="scss">
.fit-content {
  width: fit-content !important;
}
</style>
