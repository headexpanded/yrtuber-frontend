<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <router-link to="/" class="text-white text-decoration-none">
            {{ $t('labels.appName') }}</router-link
          >
        </q-toolbar-title>

        <!-- User Menu -->
        <div v-if="authStore.isAuthenticated" class="q-ml-auto">
          <q-btn-dropdown flat color="white" :label="authStore.username || ''" no-caps>
            <q-list>
              <q-item clickable v-close-popup @click="goToProfile">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>{{ $t('labels.profile') }}</q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>{{ $t('labels.logout') }}</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>

        <!-- Auth Buttons -->
        <div v-else class="q-ml-auto">
          <q-btn flat color="white" :label="$t('labels.login')" no-caps to="/auth/login" />
          <q-btn flat color="white" :label="$t('labels.register')" no-caps to="/auth/register" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Navigation</q-item-label>

        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Home</q-item-section>
        </q-item>

        <q-item v-if="authStore.isAuthenticated" clickable v-ripple to="/profile">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>{{$t('labels.profile')}}</q-item-section>
        </q-item>

        <q-separator />

        <q-item-label header> Account</q-item-label>

        <q-item v-if="!authStore.isAuthenticated" clickable v-ripple to="/auth/login">
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>
          <q-item-section>{{$t('labels.login')}}</q-item-section>
        </q-item>

        <q-item v-if="!authStore.isAuthenticated" clickable v-ripple to="/auth/register">
          <q-item-section avatar>
            <q-icon name="person_add" />
          </q-item-section>
          <q-item-section>{{$t('labels.register')}}</q-item-section>
        </q-item>

        <q-item v-if="authStore.isAuthenticated" clickable v-ripple @click="handleLogout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>{{$t('labels.logout')}}</q-item-section>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const goToProfile = async () => {
  await router.push('/profile');
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    await router.push('/');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}
</style>
