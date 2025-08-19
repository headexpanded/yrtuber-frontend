<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white">
      <q-toolbar class="q-px-sm bg-white">
        <q-btn
          aria-label="Menu"
          class="text-grey-8"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          <router-link :to="{ name: 'home' }" class="text-grey-8 text-decoration-none">
            {{ $t('labels.appName') }}
          </router-link>
        </q-toolbar-title>
        <q-input
          v-model="searchQuery"
          class="q-pt-md input-width"
          clearable
          dense
          :disable="authStore.isLoading"
          outlined
          :placeholder="$t('labels.search')"
          rounded
          @keyup.enter="handleSearch"
        >
          <q-separator vertical />
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
        <!-- User Menu -->
        <q-btn-dropdown
          v-if="authStore.isAuthenticated"
          class="q-ml-auto"
          color="grey-8"
          flat
          icon="person"
          :menu-offset="[-12, 8]"
          no-caps
          outline
        >
          <q-list>
            <q-item clickable v-close-popup @click="goToProfile">
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>{{ $t('labels.you') }}</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>{{ $t('labels.signOut') }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- Auth Buttons -->
        <div v-else class="q-ml-auto">
          <q-btn flat color="grey-8" :label="$t('labels.login')" no-caps :to="{ name: 'login' }" />
          <q-btn
            flat
            color="grey-8"
            :label="$t('labels.signUp')"
            no-caps
            :to="{ name: 'register' }"
          />
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" bordered overlay>
      <q-list>
        <q-item clickable :to="{ name: 'home' }" @click="toggleLeftDrawer">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>{{ $t('labels.home') }}</q-item-section>
        </q-item>
        <q-item v-if="authStore.isAuthenticated" clickable :to="{ name: 'profile' }">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>{{ $t('labels.you') }}</q-item-section>
        </q-item>
        <q-item v-if="authStore.isAuthenticated" clickable :to="{ name: 'following' }">
          <q-item-section avatar>
            <q-icon name="monitor" />
          </q-item-section>
          <q-item-section>{{ $t('labels.following') }}</q-item-section>
        </q-item>
      </q-list>
        <q-separator />
      <q-list>
        <q-item v-if="authStore.isAuthenticated">
          <!--<q-item-section avatar>-->
          <!--  <q-icon name="monitor" />-->
          <!--</q-item-section>-->
          <q-item-section>{{ $t('labels.categories') }}</q-item-section>
        </q-item>
        <q-item v-if="authStore.isAuthenticated" clickable :to="{ name: 'profile' }">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>{{ $t('labels.you') }}</q-item-section>
        </q-item>
        <q-item v-if="!authStore.isAuthenticated" clickable :to="{ name: 'login' }">
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>
          <q-item-section>{{ $t('labels.login') }}</q-item-section>
        </q-item>
        <q-item
          v-if="!authStore.isAuthenticated"
          clickable
          color="text-grey-8"
          :to="{ name: 'register' }"
        >
          <q-item-section avatar>
            <q-icon name="person_add" />
          </q-item-section>
          <q-item-section>{{ $t('labels.signUp') }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth-store';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const leftDrawerOpen = ref(false);
const searchQuery = ref('');

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const goToProfile = async () => {
  await router.push({ name: 'profile' });
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    await router.push({ name: 'home' });
  } catch (error) {
    console.error('Logout error:', error);
  }
};

const handleSearch = () => {
  if (searchQuery.value.trim() === '') {
    return;
  }
  // Implement search logic here
  console.log('Search query:', searchQuery.value);
};

// Check authentication status on mount
onMounted(async () => {
  if (!authStore.user) {
    try {
      await authStore.checkAuth();
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  }
});
</script>

<style scoped lang="scss">
.text-decoration-none {
  text-decoration: none;
}

.input-width {
  width: 600px;
}
</style>
