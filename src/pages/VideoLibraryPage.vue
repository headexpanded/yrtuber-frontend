<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4">My Video Library</div>
        <div class="text-caption text-grey-6">
          {{ videosResponse?.meta?.total || 0 }} videos in your library
        </div>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Add Video"
        @click="showAddVideoForm = true"
      />
    </div>

    <!-- Search and Filters -->
    <div class="row q-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <q-input
          v-model="searchQuery"
          label="Search videos"
          outlined
          dense
          @keyup.enter="loadVideos"
          @update:model-value="debounceSearch"
        >
          <template v-slot:append>
            <q-btn
              icon="search"
              flat
              round
              dense
              @click="loadVideos"
            />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-3">
        <q-select
          v-model="sortBy"
          :options="[
            { label: 'Date Added', value: 'created_at' },
            { label: 'Title', value: 'title' },
            { label: 'Channel', value: 'channel_name' },
            { label: 'Duration', value: 'duration' },
            { label: 'Views', value: 'view_count' },
            { label: 'Likes', value: 'like_count' },
          ]"
          label="Sort by"
          outlined
          dense
          @update:model-value="loadVideos"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-select
          v-model="sortOrder"
          :options="[
            { label: 'Newest First', value: 'desc' },
            { label: 'Oldest First', value: 'asc' },
          ]"
          label="Order"
          outlined
          dense
          @update:model-value="loadVideos"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center q-pa-lg">
      <q-spinner-dots size="50px" color="primary" />
      <div class="q-mt-sm">Loading videos...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center q-pa-lg">
      <q-icon name="error" size="50px" color="negative" />
      <div class="text-negative q-mt-sm">{{ error }}</div>
      <q-btn
        color="primary"
        label="Retry"
        @click="loadVideos"
        class="q-mt-md"
      />
    </div>

    <!-- Videos Grid -->
    <div v-else-if="videos.length > 0" class="row q-gutter-md">
      <div
        v-for="video in videos"
        :key="video.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <VideoCard
          :video="video"
          @video-deleted="handleVideoDeleted"
          @video-updated="handleVideoUpdated"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center q-pa-lg">
      <q-icon name="video_library" size="100px" color="grey-4" />
      <div class="text-h6 text-grey-6 q-mt-md">No videos in your library</div>
      <div class="text-caption text-grey-5 q-mb-md">
        Start building your video library by adding videos from YouTube
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Add Your First Video"
        @click="showAddVideoForm = true"
      />
    </div>

    <!-- Pagination -->
    <div v-if="videosResponse?.meta && videosResponse.meta.last_page > 1" class="q-mt-lg">
      <q-pagination
        v-model="currentPage"
        :max="videosResponse.meta.last_page"
        :max-pages="6"
        boundary-numbers
        @update:model-value="loadVideos"
      />
    </div>

    <!-- Add Video Form -->
    <AddVideoForm
      v-model="showAddVideoForm"
      @video-added="handleVideoAdded"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { VideoApiService } from 'src/services/videoApi';
import type { Video, VideosResponse } from 'src/types/Video';
import VideoCard from 'src/components/VideoCard.vue';
import AddVideoForm from 'src/components/forms/AddVideoForm.vue';

/* ============= REFS ============ */

const videos = ref<Video[]>([]);
const videosResponse = ref<VideosResponse | null>(null);
const currentPage = ref(1);
const searchQuery = ref('');
const sortBy = ref('created_at');
const sortOrder = ref('desc');
const isLoading = ref(false);
const error = ref('');
const showAddVideoForm = ref(false);

/* ========= LOCAL SCOPE ========= */

/* =========== METHODS =========== */

const loadVideos = async () => {
  isLoading.value = true;
  error.value = '';

  try {
    const params: Record<string, unknown> = {
      page: currentPage.value,
      sort_by: sortBy.value,
      sort_order: sortOrder.value,
    };

    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim();
    }

    const response = await VideoApiService.getVideos(params);
    videosResponse.value = response;
    videos.value = response.data;
  } catch (err) {
    error.value = err.message || 'Failed to load videos';
    console.error('Load videos error:', err);
  } finally {
    isLoading.value = false;
  }
};

const debounceSearch = () => {
  // Simple debounce - reset to page 1 and reload
  currentPage.value = 1;
  // Could implement proper debouncing here if needed
};

const handleVideoAdded = async () => {
  // Refresh the video list
  await loadVideos();
};

const handleVideoDeleted = (videoId: number) => {
  // Remove video from local state
  videos.value = videos.value.filter(v => v.id !== videoId);
  // Update total count
  if (videosResponse.value?.meta) {
    videosResponse.value.meta.total--;
  }
};

const handleVideoUpdated = (updatedVideo: Video) => {
  // Update video in local state
  const index = videos.value.findIndex(v => v.id === updatedVideo.id);
  if (index !== -1) {
    videos.value[index] = updatedVideo;
  }
};

/* ============ HOOKS ============ */

onMounted(async () => {
  await loadVideos();
});
</script>
