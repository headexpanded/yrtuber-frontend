<template>
  <div class="row q-col-gutter-x-xs q-col-gutter-y-xl">
    <div v-for="creator in creators" :key="creator.id" class="col-xs-12 col-sm-6 col-md-4">
      <CreatorCard :creator="creator" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { api } from 'boot/axios';
import CreatorCard from 'components/CreatorCard.vue';
import { onMounted, ref } from 'vue';

/* ============ PROPS ============ */

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */

const creators = ref([]);

/* ============ HOOKS ============ */

onMounted(async () => {
  await getFollowedCreators();
});

/* =========== METHODS =========== */

const getFollowedCreators = async () => {
  const apiUrl = 'api/follows/following';
  const params = {
    withCredentials: true,
  };
  await api
    .get<Creator[]>(apiUrl, params)
    .then((response) => {
      creators.value = response.data.data;
    })
    .catch((error) => {
      console.error('Error fetching followed creators:', error);
    });
};
</script>

<style scoped lang="scss"></style>
