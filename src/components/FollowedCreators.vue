<template>
<q-card v-for="creator in creators" :key="creator.id" class="q-mb-md">
  <q-item clickable :to="{ name: 'creator', params: { id: creator.id } }">
    <q-item-section avatar>
      <q-avatar>
        <img :src="creator.avatar_url" alt="Creator Avatar" />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <div class="text-h6">{{ creator.profile.username }}</div>
      <div class="text-subtitle2">{{ creator.profile.bio }}</div>
    </q-item-section>
  </q-item>
</q-card>
</template>
<script setup lang="ts">
/* ============ PROPS ============ */

defineProps<{
  creators: Array,
}>()

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */

/* ============ HOOKS ============ */

/* =========== METHODS =========== */

</script>

<style scoped lang="scss">

</style>
