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
import type { Collection } from 'src/types/Collection';
import { onMounted, ref } from 'vue';

/* ============ PROPS ============ */

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */

const collections = ref<Collection[]>([]);

/* ============ HOOKS ============ */

onMounted( async () => {
  await getFollowedCollections()
});

/* =========== METHODS =========== */

const getFollowedCollections = async () => {
  const apiUrl = '/api/follows/collections';
  const params = {
    withCredentials: true,
  };
  await api.get<{ data: Collection[] }>(apiUrl, params)
    .then((response) => {
      collections.value = response.data.data;
      console.log('Followed collections:', collections.value);
    })
    .catch((error) => {
      console.error('Error fetching followed collections:', error);
    });


}

</script>

<style scoped lang="scss">

</style>
