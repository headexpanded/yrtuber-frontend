<template>
  <q-drawer v-model="modelValue" bordered>
    <q-list>
      <q-item clickable :to="{ name: 'home' }" @click="modelValue = false">
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
    <q-list dense>
      <q-item v-if="authStore.isAuthenticated">
        <q-item-section class="q-pt-md text-weight-bold">{{ $t('labels.explore') }}</q-item-section>
      </q-item>
      <q-item v-if="authStore.isAuthenticated" clickable :to="{ name: 'categories' }">
        <q-item-section>{{ $t('categories.anime') }}</q-item-section>
      </q-item>
      <q-item v-if="authStore.isAuthenticated" clickable :to="{ name: 'categories' }">
        <q-item-section>{{ $t('categories.gaming') }}</q-item-section>
      </q-item>
      <q-item v-if="authStore.isAuthenticated" clickable :to="{ name: 'categories' }">
        <q-item-section>{{ $t('categories.music') }}</q-item-section>
      </q-item>
      <q-item v-if="authStore.isAuthenticated" clickable :to="{ name: 'categories' }">
        <q-item-section>{{ $t('categories.sports') }}</q-item-section>
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
</template>
<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth-store';

/* ============ PROPS ============ */

const modelValue = defineModel<boolean>({ default: false });

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */

const authStore = useAuthStore();

/* ============ HOOKS ============ */



/* =========== METHODS =========== */

</script>

<style scoped lang="scss">

</style>
