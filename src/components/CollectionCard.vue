<template>
  <q-card class="full-height" flat>
    <q-card-section class="cursor-pointer" @click="goToCollection">
      <img alt="cover image" :src="props.item.cover_image" class="cover-image" />
    </q-card-section>
    <q-card-section class="q-py-none">
      <q-item-label class="text-h6">{{ props.item.title }}</q-item-label>
    </q-card-section>
    <q-card-section class="q-py-sm">
      <q-item-label lines="2" class="q-pb-sm">{{ props.item.description }}</q-item-label>
      <div class="column text-body2 text-grey-7">
        <span>
          {{ props.item.view_count }} {{ $t('labels.views') }} | {{ localItem.like_count }}
          {{ $t('labels.likes') }}
        </span>
        <span>
          {{ $t('labels.updated') }} {{ updatedAt(props.item.updated_at) }}
        </span>
      </div>
    </q-card-section>
    <div v-for="tag in props.item.tags" :key="tag.id" class="row justify-start q-mb-sm q-pr-xs">
      <q-item-label class="tag-label text-caption">
        {{ tag.name }}
      </q-item-label>
    </div>
    <q-card-actions align="right">
      <q-btn
        flat
        round
        :color="localItem.is_liked ? 'red' : 'grey-5'"
        icon="favorite"
        size="sm"
        @click="likeOrUnlike"
      />
      <q-btn flat round color="accent" icon="bookmark" size="sm" />
      <q-btn flat round color="primary" icon="share" size="sm" />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { api } from 'boot/axios';
import { date } from 'quasar';
import type { Collection } from 'src/types/Collection';
import { defineProps, reactive, ref, watch } from 'vue';
/* ============ PROPS ============ */

const props = defineProps<{
  item: Collection;
}>();

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */

const isLiking = ref(false);
const localItem = reactive({
  like_count: props.item.like_count,
  is_liked: props.item.is_liked,
});

/* ============ HOOKS ============ */

watch(
  () => props.item,
  (newItem) => {
    localItem.like_count = newItem.like_count;
    localItem.is_liked = newItem.is_liked;
  },
  { deep: true },
);

/* =========== METHODS =========== */

const updatedAt = (updatedDate) => {
  return date.formatDate(updatedDate, 'YYYY-MM-DD');
};

const likeOrUnlike = async () => {
  if (isLiking.value) {
    return;
  }
  isLiking.value = true;
  const previousLikedState = localItem.is_liked;
  const previousLikeCount = localItem.like_count;

  try {
    // Optimistically update the UI
    localItem.is_liked = !localItem.is_liked;
    localItem.like_count += localItem.is_liked ? 1 : -1;

    if (previousLikedState) {
      await api.delete('/api/likes', {
        data: {
          likeable_type: 'App\\Models\\Collection',
          likeable_id: props.item.id,
        },
        withCredentials: true,
      });
    } else {
      await api.post(
        '/api/likes',
        {
          likeable_type: 'App\\Models\\Collection',
          likeable_id: props.item.id,
        },
        {
          withCredentials: true,
        },
      );
    }
  } catch (error) {
    localItem.is_liked = previousLikedState;
    localItem.like_count = previousLikeCount;

    console.error('Failed to like/unlike collection:', error);
    // You might want to show a user-friendly error message here
  } finally {
    isLiking.value = false;
  }
};

const goToCollection = () => {
  console.log('Navigating to collection:', props.item.id);
  // Use Vue Router to navigate to the collection page
};
</script>

<style scoped lang="scss">
.cover-image {
  width: 100%;
  height: 200px; // Fixed height for consistency
  object-fit: cover; // Maintains aspect ratio while filling the space
  object-position: center; // Centers the image within the container
  border-radius: 4px; // Optional: rounded corners
}
</style>
