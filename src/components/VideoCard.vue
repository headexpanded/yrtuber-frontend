<template>
  <q-card class="video-card full-height" flat>
    <q-img
      :src="video.thumbnail_url || 'https://via.placeholder.com/300x200?text=No+Thumbnail'"
      height="200px"
      fit="cover"
    >
      <div class="absolute-bottom text-subtitle2 text-center bg-transparent">
        <q-chip
          v-if="video.duration"
          size="sm"
          color="black"
          text-color="white"
          class="q-mb-sm"
        >
          {{ formatDuration(video.duration) }}
        </q-chip>
      </div>
    </q-img>

    <q-card-section>
      <div class="text-h6 text-truncate" :title="video.title">
        {{ video.title }}
      </div>
      <div class="text-caption text-grey-6 q-mb-sm">
        {{ video.channel_name }}
      </div>
      <div class="text-caption text-grey-5">
        <q-icon name="visibility" size="xs" />
        {{ formatNumber(video.view_count || 0) }} views
        <span v-if="video.like_count" class="q-ml-md">
          <q-icon name="thumb_up" size="xs" />
          {{ formatNumber(video.like_count) }}
        </span>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        flat
        round
        color="grey"
        icon="more_vert"
        @click="showMenu = true"
      >
        <q-menu v-model="showMenu">
          <q-list style="min-width: 150px">
            <q-item clickable v-close-popup @click="openVideo">
              <q-item-section avatar>
                <q-icon name="play_arrow" />
              </q-item-section>
              <q-item-section>Watch on YouTube</q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="refreshMetadata">
              <q-item-section avatar>
                <q-icon name="refresh" />
              </q-item-section>
              <q-item-section>Refresh Metadata</q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-close-popup @click="showDeleteDialog = true">
              <q-item-section avatar>
                <q-icon name="delete" color="negative" />
              </q-item-section>
              <q-item-section class="text-negative">Delete</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-card-actions>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Delete Video</span>
        </q-card-section>

        <q-card-section>
          Are you sure you want to delete "{{ video.title }}"? This action cannot be undone.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Delete"
            color="negative"
            @click="deleteVideo"
            :loading="isDeleting"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VideoApiService } from 'src/services/videoApi';
import type { Video } from 'src/types/Video';
import { Notifier } from 'src/utils/Notifier';

/* ============ PROPS ============ */

interface Props {
  video: Video;
}

const props = defineProps<Props>();

/* ============ EMITS ============ */

interface Emits {
  (e: 'video-deleted', videoId: number): void;
  (e: 'video-updated', video: Video): void;
}

const emit = defineEmits<Emits>();

/* ============= REFS ============ */

const showMenu = ref(false);
const showDeleteDialog = ref(false);
const isDeleting = ref(false);

/* =========== METHODS =========== */

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const openVideo = () => {
  const url = `https://www.youtube.com/watch?v=${props.video.youtube_id}`;
  window.open(url, '_blank');
};

const refreshMetadata = async () => {
  try {
    const response = await VideoApiService.refreshMetadata(props.video.id);
    emit('video-updated', response.video);
    Notifier.quickPositive('labels.videoMetadataRefreshed');
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to refresh metadata';
    Notifier.quickNegative(errorMessage);
    console.error('Refresh metadata error:', err);
  }
};

const deleteVideo = async () => {
  isDeleting.value = true;

  try {
    await VideoApiService.deleteVideo(props.video.id);
    emit('video-deleted', props.video.id);
    Notifier.quickPositive('labels.videoDeleted');
    showDeleteDialog.value = false;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to delete video';
    Notifier.quickNegative(errorMessage);
    console.error('Delete video error:', err);
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped lang="scss">
.video-card {
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
</style>
