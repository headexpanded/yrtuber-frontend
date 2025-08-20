<template>
  <q-card class="full-height">
    <q-item class="cursor-pointer" @click="goToCreator">
      <q-item-section avatar>
        <q-avatar>
          <div class="avatar-border">
            <img :src="creator.profile.avatar" alt="Creator Avatar" />
          </div>
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6">{{ creator.profile.username }}</q-item-label>
        <q-item-label class="text-caption text-grey-7">
          {{ creator.profile.bio }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>
<script setup lang="ts">
import type { Creator } from 'src/types/Creator';
import { defineProps } from 'vue';

/* ============ PROPS ============ */

const props = defineProps<{
  creator: Creator;
}>();

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */

/* ============ HOOKS ============ */

/* =========== METHODS =========== */

const goToCreator = () => {
  console.log('Navigating to creator:', props.creator.id);
};
</script>

<style scoped lang="scss">
.q-card {
  width: 100%;
  height: 100%;

  .avatar-border {
    height: 100%;
    width: 100%;
    padding: 1px;
    border-radius: 50%;
    background-color: $positive;

    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      object-fit: cover;

    }
  }
}
</style>
