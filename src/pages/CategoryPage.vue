<template>
  <q-page class="row items-center justify-evenly">
    <q-list v-for="item in collection">
      <q-item-section>
        <q-item-label>{{ item.title }}</q-item-label>
        <q-item-label caption lines="2">{{ item.description }}</q-item-label>
      </q-item-section>
    </q-list>
  </q-page>
</template>
<script setup lang="ts">
/* ============ PROPS ============ */

import { api } from 'boot/axios';
import { onMounted, ref } from 'vue';

defineProps<{
  collectionId?: number;
}>();

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */
const collection = ref({
  id: 0,
  name: '',
  description: '',
  image: '',
  slug: '',
  created_at: '',
  updated_at: '',
});
/* ============ HOOKS ============ */

onMounted(async () => {
  collection.value = (await api.get('/api/collections/240', { withCredentials: true })).data;
  console.log('Collection: ', collection.value);
});

/* =========== METHODS =========== */
</script>

<style scoped lang="scss"></style>
