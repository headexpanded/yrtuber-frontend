<template>
  <q-card class="full-height">
    <q-card-section horizontal>
      <div class="row items-center q-pa-md full-width">
        <div class="row items-center">
          <q-avatar>
            <div class="avatar-border">
              <img :src="creator.profile.avatar" alt="Creator Avatar" />
            </div>
          </q-avatar>
          <q-item-label class="q-pl-md text-h6">{{ creator.profile.username }}</q-item-label>
        </div>
        <q-space />
        <q-icon color="grey-8" name="arrow_forward" />
        <RouterLink to="/creator-collections" class="q-pl-sm text-body2 text-grey-8">{{ $t('labels.collections') }}</RouterLink>
      </div>
    </q-card-section>
    <q-item>
      <q-item-section>
        <q-item-label class="q-pb-md text-body1 text-grey-7">
          {{ $t('labels.aboutMe') }}
        </q-item-label>
        <div class="text-caption text-grey-7">
          {{ creator.profile.bio }}
        </div>
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
      >
        <q-tooltip
          v-if="localItem.is_followed"
          anchor="center left"
          class="bg-grey-7 text-body2 text-bold"
          self="center right"
        >
          {{ $t('labels.stopFollowing') }}
        </q-tooltip>
      </q-btn>
      <q-btn flat round color="accent" icon="bookmark" size="sm" />
      <q-btn flat round color="primary" icon="share" size="sm" />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { api } from 'boot/axios';
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
  follower_count: props.creator.profile.follower_count,
  is_followed: props.creator.is_followed,
});

/* ============ HOOKS ============ */

watch(
  () => props.creator,
  (newItem) => {
    localItem.value.follower_count = newItem.profile.follower_count;
    localItem.value.is_followed = newItem.is_followed;
  },
  { deep: true },
);

/* =========== METHODS =========== */

const goToCreatorCollections = async () => {
  console.log('Navigating to creator:', props.creator.id);
  const apiUrl = `/api/users/${props.creator.id}/collections`;
  const params = {
    withCredentials: true,
  };
  await api
    .get(apiUrl, params)
    .then((response) => {
      console.log('Creator collections:', response.data);
      // Navigate to the creator's collections page
      // This could be a router push or similar navigation logic
    })
    .catch((error) => {
      console.error('Error fetching creator collections:', error);
    });
};

const followOrUnfollow = () => {
  console.log('Follow or unfollow');
  isFollowed.value = !isFollowed.value;
  localItem.value.is_followed = isFollowed.value;
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
  a {
    text-decoration: none;

    &:visited {
      color: inherit;
    }
  }
}
</style>
