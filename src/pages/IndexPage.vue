<template>
  <q-page padding>
    <div class="row q-col-gutter-x-xs q-col-gutter-y-xl">
      <div v-for="item in collections" :key="item.id" class="col-xs-12 col-sm-6 col-md-4">
        <CollectionCard :item="item" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">

import { api } from 'boot/axios';
import CollectionCard from 'components/CollectionCard.vue';
import type { Collection } from 'src/types/Collection';
import { onMounted, ref } from 'vue';

const collections = ref<Collection[]>([]);

onMounted( async () => {
  await getCollections()
});

const getCollections = async () => {
  const apiUrl = '/api/collections';
  const params = {
    withCredentials: true,
  };
  await api.get<{ data: Collection[] }>(apiUrl, params)
           .then((response) => {
             collections.value = response.data.data;
           })
           .catch((error) => {
             console.error('Error fetching followed collections:', error);
           });
}
</script>
