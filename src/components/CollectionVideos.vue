<template>
  <div class="row q-col-gutter-x-xs q-col-gutter-y-xl">
    <div v-for="vid in videos" :key="vid.id" class="col-xs-12 col-sm-6 col-md-4">
      <VideoCard :video="vid" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { api } from 'boot/axios';
import VideoCard from 'components/VideoCard.vue';
import { type Video } from 'src/types/Video';
import { onMounted, ref } from 'vue';

/* ============ PROPS ============ */

const props = defineProps({
  collectionId: {
    type: String,
    required: true
  },
});

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */

const videos = ref<Video[]>([]); // This should be populated with video data, e.g., from an API call

/* ============ HOOKS ============ */

onMounted( async () => {
  await getCollectionVideos()
});

/* =========== METHODS =========== */
const getCollectionVideos = async () => {
  // NEED TO GET VIDEOS FOR A COLLECTION
  const apiUrl = `/api/collections/${props.collectionId}/videos`;
  const params = {
    withCredentials: true,
  };
  await api.get<{ data: Video[] }>(apiUrl, params)
           .then((response) => {
             console.log('Collection videos:', response.data.data);
             videos.value = response.data.data;
           })
           .catch((error) => {
             console.error('Error fetching creator collections:', error);
           });
}

</script>

<style scoped lang="scss">

</style>
