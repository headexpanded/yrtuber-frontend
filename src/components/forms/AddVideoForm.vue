<template>
  <q-dialog v-model="isVisible" persistent>
    <q-card style="min-width: 600px; max-width: 800px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Add Video to Library</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="search" label="Search YouTube" />
          <q-tab name="url" label="Add by URL/ID" />
          <q-tab name="manual" label="Manual Entry" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated>
          <!-- YouTube Search Tab -->
          <q-tab-panel name="search" class="q-pa-none">
            <div class="q-pa-md">
              <q-input
                v-model="searchQuery"
                label="Search YouTube videos"
                outlined
                @keyup.enter="searchVideos"
                :loading="isSearching"
              >
                <template v-slot:append>
                  <q-btn icon="search" flat round @click="searchVideos" :loading="isSearching" />
                </template>
              </q-input>

              <div v-if="searchResults.length > 0" class="q-mt-md">
                <div class="text-subtitle2 q-mb-sm">Search Results</div>
                <q-list>
                  <q-item
                    v-for="result in searchResults"
                    :key="result.id"
                    clickable
                    @click="selectSearchResult(result)"
                    class="q-mb-sm"
                  >
                    <q-item-section avatar>
                      <q-img :src="result.thumbnail_url" width="120px" height="90px" fit="cover" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">{{ result.title }}</q-item-label>
                      <q-item-label caption>{{ result.channel_name }}</q-item-label>
                      <q-item-label caption>
                        {{ formatDuration(result.duration) }} •
                        {{ formatNumber(result.view_count) }} views
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        color="primary"
                        label="Add"
                        size="sm"
                        @click.stop="addSearchResult(result)"
                        :loading="isAdding"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <div v-if="searchError" class="text-negative q-mt-md">
                {{ searchError }}
              </div>

              <div v-if="youtubeApiNotAvailable" class="text-warning q-mt-md">
                <q-banner class="bg-warning-1 text-warning-8">
                  <template v-slot:avatar>
                    <q-icon name="warning" color="warning" />
                  </template>
                  YouTube API is not available. Use the "Manual Entry" tab to add videos for
                  testing.
                </q-banner>
              </div>
            </div>
          </q-tab-panel>

          <!-- URL/ID Tab -->
          <q-tab-panel name="url" class="q-pa-none">
            <div class="q-pa-md">
              <q-input
                v-model="youtubeInput"
                label="YouTube URL or Video ID"
                outlined
                placeholder="https://www.youtube.com/watch?v=... or dQw4w9WgXcQ"
                @keyup.enter="validateAndAddVideo"
                :loading="isValidating"
              >
                <template v-slot:append>
                  <q-btn
                    icon="add"
                    flat
                    round
                    @click="validateAndAddVideo"
                    :loading="isValidating"
                  />
                </template>
              </q-input>

              <div v-if="validationResult" class="q-mt-md">
                <q-banner
                  :class="validationResult.valid ? 'bg-positive' : 'bg-negative'"
                  class="text-white"
                >
                  {{ validationResult.message }}
                </q-banner>
              </div>

              <div v-if="selectedVideo" class="q-mt-md">
                <q-card>
                  <q-card-section>
                    <div class="row">
                      <div class="col-4">
                        <q-img
                          :src="selectedVideo.thumbnail_url"
                          width="100%"
                          height="150px"
                          fit="cover"
                        />
                      </div>
                      <div class="col-8 q-pl-md">
                        <div class="text-h6">{{ selectedVideo.title }}</div>
                        <div class="text-caption">{{ selectedVideo.channel_name }}</div>
                        <div class="text-caption">
                          {{ formatDuration(selectedVideo.duration) }} •
                          {{ formatNumber(selectedVideo.view_count) }} views
                        </div>
                        <q-btn
                          color="primary"
                          label="Add to Library"
                          class="q-mt-sm"
                          @click="addSelectedVideo"
                          :loading="isAdding"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <div v-if="youtubeApiNotAvailable" class="text-warning q-mt-md">
                <q-banner class="bg-warning-1 text-warning-8">
                  <template v-slot:avatar>
                    <q-icon name="warning" color="warning" />
                  </template>
                  YouTube API is not available. Use the "Manual Entry" tab to add videos for
                  testing.
                </q-banner>
              </div>
            </div>
          </q-tab-panel>

          <!-- Manual Entry Tab -->
          <q-tab-panel name="manual" class="q-pa-none">
            <div class="q-pa-md">
              <q-form @submit="addManualVideo" class="q-gutter-md">
                <q-input
                  v-model="manualVideo.youtube_id"
                  label="YouTube Video ID *"
                  outlined
                  :rules="[(val) => !!val || 'YouTube ID is required']"
                  placeholder="dQw4w9WgXcQ"
                />

                <q-input
                  v-model="manualVideo.title"
                  label="Title *"
                  outlined
                  :rules="[(val) => !!val || 'Title is required']"
                />

                <q-input
                  v-model="manualVideo.description"
                  label="Description"
                  outlined
                  type="textarea"
                />

                <q-input
                  v-model="manualVideo.thumbnail_url"
                  label="Thumbnail URL"
                  outlined
                  placeholder="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
                />

                <q-input
                  v-model="manualVideo.channel_name"
                  label="Channel Name *"
                  outlined
                  :rules="[(val) => !!val || 'Channel name is required']"
                />

                <q-input
                  v-model="manualVideo.channel_id"
                  label="Channel ID *"
                  outlined
                  :rules="[(val) => !!val || 'Channel ID is required']"
                  placeholder="UC..."
                />

                <div class="row q-gutter-md">
                  <div class="col">
                    <q-input
                      v-model.number="manualVideo.duration"
                      label="Duration (seconds)"
                      outlined
                      type="number"
                      min="0"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      v-model.number="manualVideo.view_count"
                      label="View Count"
                      outlined
                      type="number"
                      min="0"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      v-model.number="manualVideo.like_count"
                      label="Like Count"
                      outlined
                      type="number"
                      min="0"
                    />
                  </div>
                </div>

                <q-input
                  v-model="manualVideo.published_at"
                  label="Published Date"
                  outlined
                  type="date"
                />

                <div class="row q-gutter-md justify-end">
                  <q-btn label="Add Video" color="primary" type="submit" :loading="isAdding" />
                </div>
              </q-form>
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <div v-if="error" class="text-negative text-center q-mt-md">
          {{ error }}
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { VideoApiService } from 'src/services/videoApi';
import type {
  CreateVideoData,
  Video,
  YouTubeSearchResult,
  YouTubeValidationResponse,
} from 'src/types/Video';
import { Notifier } from 'src/utils/Notifier';
// Reset form when dialog opens
import { computed, ref, watch } from 'vue';

/* ============ PROPS ============ */

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();

/* ============ EMITS ============ */

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'video-added', video: Video): void;
}

const emit = defineEmits<Emits>();

/* ============= REFS ============ */

const activeTab = ref('search');
const searchQuery = ref('');
const youtubeInput = ref('');
const searchResults = ref<YouTubeSearchResult[]>([]);
const selectedVideo = ref<YouTubeSearchResult | null>(null);
const validationResult = ref<YouTubeValidationResponse | null>(null);

const isSearching = ref(false);
const isValidating = ref(false);
const isAdding = ref(false);
const searchError = ref('');
const error = ref('');
const youtubeApiNotAvailable = ref(false);

// Manual video entry form
const manualVideo = ref<CreateVideoData>({
  youtube_id: '',
  title: '',
  description: '',
  thumbnail_url: '',
  channel_name: '',
  channel_id: '',
});

/* ============ COMPUTED ============ */

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

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

const searchVideos = async () => {
  if (!searchQuery.value.trim()) return;

  isSearching.value = true;
  searchError.value = '';

  try {
    const response = await VideoApiService.searchYouTube(searchQuery.value, 10);
    searchResults.value = response.results;
    youtubeApiNotAvailable.value = false;
  } catch (err: unknown) {
    searchError.value = err instanceof Error ? err.message : 'Failed to search videos';
    youtubeApiNotAvailable.value = true;
    console.error('Search error:', err);
  } finally {
    isSearching.value = false;
  }
};

const selectSearchResult = (result: YouTubeSearchResult) => {
  selectedVideo.value = result;
};

const addSearchResult = async (result: YouTubeSearchResult) => {
  await addVideo(result);
};

const validateAndAddVideo = async () => {
  if (!youtubeInput.value.trim()) return;

  isValidating.value = true;
  validationResult.value = null;
  selectedVideo.value = null;

  try {
    const validation = await VideoApiService.validateYouTube(youtubeInput.value);
    validationResult.value = validation;

    if (validation.valid && validation.youtube_id) {
      // Try to get video details from YouTube search
      try {
        const searchResponse = await VideoApiService.searchYouTube(youtubeInput.value, 1);
        if (searchResponse.results.length > 0) {
          const result = searchResponse.results[0];
          if (result && result.id === validation.youtube_id) {
            selectedVideo.value = result;
          }
        }
      } catch (searchErr) {
        // If search fails, we can still add the video with just the ID
        console.log('Could not fetch video details, will add with ID only', searchErr);
      }
    }
    youtubeApiNotAvailable.value = false;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to validate YouTube input';
    validationResult.value = {
      valid: false,
      message: errorMessage,
    };
    youtubeApiNotAvailable.value = true;
    console.error('Validation error:', err);
  } finally {
    isValidating.value = false;
  }
};

const addSelectedVideo = async () => {
  if (!selectedVideo.value) return;
  await addVideo(selectedVideo.value);
};

const addVideo = async (videoData: YouTubeSearchResult) => {
  isAdding.value = true;
  error.value = '';

  try {
    const response = await VideoApiService.createEnhancedVideo({
      youtube_id: videoData.id,
      auto_fetch_metadata: true,
      title: videoData.title,
      description: videoData.description,
      thumbnail_url: videoData.thumbnail_url,
      channel_name: videoData.channel_name,
      channel_id: videoData.channel_id,
      duration: videoData.duration,
      published_at: videoData.published_at,
      view_count: videoData.view_count,
      like_count: videoData.like_count,
    });

    Notifier.quickPositive('labels.videoAdded');
    emit('video-added', response.video);
    isVisible.value = false;
    resetForm();
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to add video';
    console.error('Add video error:', err);
  } finally {
    isAdding.value = false;
  }
};

const addManualVideo = async () => {
  isAdding.value = true;
  error.value = '';

  try {
    const response = await VideoApiService.createVideo(manualVideo.value);

    Notifier.quickPositive('labels.videoAdded');
    emit('video-added', response.video);
    isVisible.value = false;
    resetForm();
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to add video';
    console.error('Add manual video error:', err);
  } finally {
    isAdding.value = false;
  }
};

const resetForm = () => {
  searchQuery.value = '';
  youtubeInput.value = '';
  searchResults.value = [];
  selectedVideo.value = null;
  validationResult.value = null;
  searchError.value = '';
  error.value = '';
  youtubeApiNotAvailable.value = false;
  activeTab.value = 'search';

  // Reset manual form
  manualVideo.value = {
    youtube_id: '',
    title: '',
    description: '',
    thumbnail_url: '',
    channel_name: '',
    channel_id: '',
  };
};

watch(isVisible, (visible) => {
  if (visible) {
    resetForm();
  }
});
</script>

<style scoped lang="scss">
.q-card {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
