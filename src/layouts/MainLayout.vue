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
        <!-- User Menu -->
        <q-btn-dropdown
          v-if="authStore.isAuthenticated"
          class="q-ml-auto"
          flat
          color="grey-8"
          icon="person"
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
              <q-item-section>{{ $t('labels.logout') }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- Auth Buttons -->
        <div v-else class="q-ml-auto">
          <q-btn flat color="grey-8" :label="$t('labels.login')" no-caps :to="{ name: 'login' }" />
          <q-btn
            flat
            color="grey-8"
            :label="$t('labels.register')"
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
        <q-item v-if="authStore.isAuthenticated" clickable to="/profile">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>{{ $t('labels.you') }}</q-item-section>
        </q-item>
        <q-item v-if="authStore.isAuthenticated" clickable to="/profile">
          <q-item-section avatar>
            <q-icon name="monitor" />
          </q-item-section>
          <q-item-section>{{ $t('labels.following') }}</q-item-section>
        </q-item>
        <q-item v-if="!authStore.isAuthenticated" clickable to="/auth/login">
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>
          <q-item-section>{{ $t('labels.login') }}</q-item-section>
        </q-item>
        <q-item v-if="!authStore.isAuthenticated" clickable color="text-grey-8" to="/auth/register">
          <q-item-section avatar>
            <q-icon name="person_add" />
          </q-item-section>
          <q-item-section>{{ $t('labels.register') }}</q-item-section>
        </q-item>
        <q-item v-if="authStore.isAuthenticated" clickable @click="handleLogout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>{{ $t('labels.logout') }}</q-item-section>
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
</script>

<style scoped lang="scss">
.text-decoration-none {
  text-decoration: none;
}
</style>
