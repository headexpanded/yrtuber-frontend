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

const creators = ref([])

/* ============ HOOKS ============ */

onMounted(async () => {
  const response = await api.get('api/follows/following', {
    withCredentials: true,
  });
  console.log("Creators: ", response.data);
  creators.value = response.data.data;
});

/* =========== METHODS =========== */

</script>

<style scoped lang="scss">

</style>
