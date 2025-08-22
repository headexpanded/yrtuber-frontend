<template>
  <q-page padding>
    <CreatorCollections :creator-id="props.creatorId" />
  </q-page>
</template>
<script setup lang="ts">
import CreatorCollections from 'components/CreatorCollections.vue';
import { defineProps } from 'vue';

/* ============ PROPS ============ */

const props = defineProps<{
  creatorId: string;
}>();

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */

/* ============ HOOKS ============ */

/* =========== METHODS =========== */

</script>

<style scoped lang="scss"></style>
