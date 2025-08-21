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
import { useAuthStore } from 'stores/auth-store';
import { onMounted, ref } from 'vue';

/* ============ PROPS ============ */

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */

const authStore = useAuthStore();
const collections = ref<Collection[]>([]);

/* ============ HOOKS ============ */

onMounted( async () => {
  await getCreatorCollections()
});

/* =========== METHODS =========== */

const getCreatorCollections = async () => {
  const creatorId = authStore.user?.id;
  const apiUrl = `/api/users/${creatorId}/collections`;
  const params = {
    withCredentials: true,
  };
  await api.get<{ data: Collection[] }>(apiUrl, params)
           .then((response) => {
             collections.value = response.data.data;
             console.log('Creator collections:', collections.value);
           })
           .catch((error) => {
             console.error('Error fetching creator collections:', error);
           });
}

</script>

<style scoped lang="scss">

</style>
