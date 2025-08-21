<template>
<q-page padding>
 <CollectionVideos :collectionId />
</q-page>
</template>
<script setup lang="ts">
import CollectionVideos from 'components/CollectionVideos.vue';
import { ref } from 'vue';
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

const collectionId = ref(props.collectionId);

/* ============ HOOKS ============ */

/* =========== METHODS =========== */


</script>

<style scoped lang="scss">

</style>
