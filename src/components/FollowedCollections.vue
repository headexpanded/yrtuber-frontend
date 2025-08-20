<template>
  <div class="row q-col-gutter-x-xs q-col-gutter-y-xl">
    <div v-for="item in collections" :key="item.id" class="col-xs-12 col-sm-6 col-md-4">
      <CollectionCard :item="item" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { api } from 'boot/axios';
import CollectionCard from 'components/CollectionCard.vue';
import type { Collection } from 'types/collection';
import { onMounted, ref } from 'vue';

/* ============ PROPS ============ */

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */

const collections = ref<Collection[]>([]);

/* ============ HOOKS ============ */

onMounted(async () => {
  const response = await api.get<Collection[]>('/api/users/500/collections', {
    withCredentials: true,
  });
  console.log('Collection: ', response);
  collections.value = response.data.data;
});

/* =========== METHODS =========== */

</script>

<style scoped lang="scss">

</style>
