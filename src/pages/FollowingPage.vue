<template>
  <q-page class="q-pa-md">
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
        <div class="row q-col-gutter-x-xs q-col-gutter-y-xl">
          <div v-for="item in collections" :key="item.id" class="col-xs-12 col-sm-6 col-md-4">
            <CollectionCard :item="item" />
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="creators">
        <FollowedCreators :creators="creators" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
<script setup lang="ts">
import { api } from 'boot/axios';
import CollectionCard from 'components/CollectionCard.vue';
import FollowedCreators from 'components/FollowedCreators.vue';
import type { Collection } from 'src/types/Collection';
import { onMounted, ref } from 'vue';

/* ============ PROPS ============ */

defineProps<{
  collectionId?: number;
}>();

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */

const activeTab = ref('collections');
const collections = ref<Collection[]>([]);
const creators = ref([])
/* ============ HOOKS ============ */

onMounted(async () => {
  const response = await api.get<Collection[]>('/api/users/500/collections', {
    withCredentials: true,
  });
  console.log('Collection: ', response);
  collections.value = response.data.data;

  const test = await api.get('api/follows/following', {
    withCredentials: true,
  });
  console.log("Creators: ", test);
  creators.value = test.data.data;
});

/* =========== METHODS =========== */


</script>

<style scoped lang="scss">
//.q-card {
//  width: 100%;
//  max-width: 400px;
//}
</style>
