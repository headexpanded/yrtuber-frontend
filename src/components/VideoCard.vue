<template>
  <q-card class="full-height" flat> Here is a video {{ video.id }} </q-card>
</template>
<script setup lang="ts">
/* ============ PROPS ============ */

import { type Video } from 'src/types/Video';
import { defineProps } from 'vue';

const props = defineProps<{
  // Define the props for the VideoCard component
  video: Video;
}>();

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */

/* ============ HOOKS ============ */

/* =========== METHODS =========== */
</script>

<style scoped lang="scss"></style>
