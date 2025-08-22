<template>
  <q-dialog v-model="isVisible" persistent>
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Edit Collection</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form
          ref="collectionForm"
          @submit="handleSubmit"
          class="q-gutter-md"
        >
          <q-input
            v-model="formData.title"
            label="Title *"
            outlined
            :rules="[
              (val) => !!val || 'Title is required',
              (val) => val.length <= 255 || 'Title must be 255 characters or less'
            ]"
          />

          <q-input
            v-model="formData.description"
            label="Description"
            outlined
            type="textarea"
            :rules="[
              (val) => !val || val.length <= 2000 || 'Description must be 2000 characters or less'
            ]"
          />

          <q-input
            v-model="formData.cover_image"
            label="Cover Image URL"
            outlined
            :rules="[
              (val) => !val || /^https?:\/\/.+/.test(val) || 'Please enter a valid URL'
            ]"
          />

          <q-select
            v-model="formData.layout"
            :options="layoutOptions"
            label="Layout *"
            outlined
            :rules="[(val) => !!val || 'Layout is required']"
          />

          <div class="row q-gutter-md">
            <div class="col">
              <q-toggle
                v-model="formData.is_public"
                label="Public Collection"
                color="primary"
              />
            </div>
            <div class="col">
              <q-toggle
                v-model="formData.is_published"
                label="Publish Collection"
                color="primary"
                :disable="!canPublish"
              />
            </div>
          </div>

          <div v-if="!canPublish" class="text-caption text-grey-6">
            Note: Collection must have at least one video to be published
          </div>

          <div v-if="error" class="text-negative text-center q-mb-md">
            {{ error }}
          </div>

          <div class="row q-gutter-md justify-end">
            <q-btn
              label="Cancel"
              color="grey"
              flat
              v-close-popup
            />
            <q-btn
              label="Update Collection"
              color="primary"
              :loading="isLoading"
              type="submit"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QForm } from 'quasar';
import { ref, computed, watch } from 'vue';
import { CollectionApiService } from 'src/services/collectionApi';
import type { Collection, UpdateCollectionData } from 'src/types/Collection';
import { Notifier } from 'src/utils/Notifier';

/* ============ PROPS ============ */

interface Props {
  modelValue: boolean;
  collection?: Collection;
}

const props = defineProps<Props>();

/* ============ EMITS ============ */

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'collection-updated', collection: Collection): void;
}

const emit = defineEmits<Emits>();

/* ========= LOCAL SCOPE ========= */

const layoutOptions = [
  { label: 'Grid', value: 'grid' },
  { label: 'List', value: 'list' },
  { label: 'Carousel', value: 'carousel' },
  { label: 'Magazine', value: 'magazine' },
];

/* ============= REFS ============ */

const collectionForm = ref<QForm | null>(null);
const isLoading = ref(false);
const error = ref('');

const formData = ref<UpdateCollectionData>({
  title: '',
  description: '',
  cover_image: '',
  layout: 'grid',
  is_public: true,
  is_published: false,
});

/* ============ COMPUTED ============ */

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const canPublish = computed(() => {
  // For MVP, we'll allow publishing without videos for now
  // In a real implementation, this would check if videos are attached
  return true;
});

/* =========== METHODS =========== */

const loadCollectionData = () => {
  if (props.collection) {
    formData.value = {
      title: props.collection.title,
      description: props.collection.description || '',
      cover_image: props.collection.cover_image || '',
      layout: props.collection.layout,
      is_public: props.collection.is_public,
      is_published: props.collection.is_published,
    };
  }
};

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    cover_image: '',
    layout: 'grid',
    is_public: true,
    is_published: false,
  };
  error.value = '';
  collectionForm.value?.resetValidation();
};

const handleSubmit = async () => {
  if (!collectionForm.value || !props.collection) return;

  collectionForm.value.resetValidation();
  const isValid = await collectionForm.value.validate();
  if (!isValid) return;

  isLoading.value = true;
  error.value = '';

  try {
    // Ensure layout is a string value, not an object
    const layoutValue = typeof formData.value.layout === 'object' && formData.value.layout !== null
      ? (formData.value.layout as { value: string }).value
      : formData.value.layout;

    const submitData: UpdateCollectionData = {
      ...formData.value,
      layout: layoutValue as 'grid' | 'list' | 'carousel' | 'magazine'
    };

    console.log('Updating collection data:', submitData);
    const response = await CollectionApiService.updateCollection(
      props.collection.id,
      submitData
    );

    Notifier.quickPositive('labels.collectionUpdated');
    emit('collection-updated', response.collection);
    isVisible.value = false;
  } catch (err) {
    error.value = err.message || 'Failed to update collection';
    console.error('Update collection error:', err);
  } finally {
    isLoading.value = false;
  }
};

// Load collection data when dialog opens or collection changes
watch(
  () => [isVisible.value, props.collection],
  () => {
    if (isVisible.value && props.collection) {
      loadCollectionData();
    } else if (!isVisible.value) {
      resetForm();
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.q-card {
  max-width: 600px;
}
</style>
