<template>
  <q-tabs
    v-model="activeTab"
    align="justify"
    active-color="primary"
    class="text-grey"
    indicator-color="primary"
    narrow-indicator
  >
    <q-tab name="collections" :label="$t('labels.collections')" />
    <q-tab name="creators" :label="$t('labels.creators')" />
  </q-tabs>
  <q-tab-panels v-model="activeTab" animated>
    <q-tab-panel name="collections">
        <FollowedCollections />
    </q-tab-panel>
    <q-tab-panel name="creators">
      <div class="row q-col-gutter-x-xs q-col-gutter-y-xl">
        <FollowedCreators />
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>
<script setup lang="ts">
import FollowedCollections from 'components/FollowedCollections.vue';
import FollowedCreators from 'components/FollowedCreators.vue';
import { ref } from 'vue';

/* ============ PROPS ============ */

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */

const activeTab = ref('collections');

/* ============ HOOKS ============ */



/* =========== METHODS =========== */


</script>

<style scoped lang="scss">

</style>
