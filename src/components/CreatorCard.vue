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
    <q-card-actions align="right">
      <q-btn
        flat
        round
        :color="localItem.is_followed ? 'red' : 'grey-5'"
        icon="favorite"
        size="sm"
        @click="followOrUnfollow"
      />
      <q-btn flat round color="accent" icon="bookmark" size="sm" />
      <q-btn flat round color="primary" icon="share" size="sm" />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import type { Creator } from 'src/types/Creator';
import { defineProps, ref, watch } from 'vue';

/* ============ PROPS ============ */

const props = defineProps<{
  creator: Creator;
}>();

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */

const isFollowed = ref(false);
const localItem = ref({
  follower_count: props.creator.follower_count,
  is_followed: props.creator.is_followed,
});

/* ============ HOOKS ============ */

watch(
  () => props.creator,
  (newItem) => {
    localItem.value.follower_count = newItem.follower_count;
    localItem.value.is_followed = newItem.is_followed;
  },
  { deep: true },
);

/* =========== METHODS =========== */

const goToCreator = () => {
  console.log('Navigating to creator:', props.creator.id);
};

const followOrUnfollow = () => {
  console.log("Follow or unfollow")
  isFollowed.value = !isFollowed.value;
  localItem.value.is_followed = isFollowed.value;
}
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
