<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">Collection Forms Test</div>

    <div class="row q-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Create Collection Form</div>
            <p class="text-caption">Test the collection creation form</p>
          </q-card-section>
          <q-card-actions>
            <q-btn
              color="primary"
              label="Open Create Form"
              @click="showCreateForm = true"
            />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Edit Collection Form</div>
            <p class="text-caption">Test the collection editing form</p>
          </q-card-section>
          <q-card-actions>
            <q-btn
              color="secondary"
              label="Open Edit Form"
              @click="showEditForm = true"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Sample collection for edit form -->
    <div v-if="sampleCollection" class="q-mt-lg">
      <q-card>
        <q-card-section>
          <div class="text-h6">Sample Collection for Testing</div>
          <div class="text-body2">
            <strong>Title:</strong> {{ sampleCollection.title }}<br>
            <strong>Description:</strong> {{ sampleCollection.description }}<br>
            <strong>Layout:</strong> {{ sampleCollection.layout }}<br>
            <strong>Public:</strong> {{ sampleCollection.is_public ? 'Yes' : 'No' }}<br>
            <strong>Published:</strong> {{ sampleCollection.is_published ? 'Yes' : 'No' }}
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Create Collection Form -->
    <CreateCollectionForm
      v-model="showCreateForm"
      @collection-created="handleCollectionCreated"
    />

    <!-- Edit Collection Form -->
    <EditCollectionForm
      v-model="showEditForm"
      :collection="sampleCollection"
      @collection-updated="handleCollectionUpdated"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CreateCollectionForm from 'src/components/forms/CreateCollectionForm.vue';
import EditCollectionForm from 'src/components/forms/EditCollectionForm.vue';
import type { Collection } from 'src/types/Collection';

/* ============= REFS ============ */

const showCreateForm = ref(false);
const showEditForm = ref(false);

// Sample collection for testing the edit form
const sampleCollection = ref<Collection>({
  id: 1,
  user_id: 1,
  title: 'Sample Collection',
  slug: 'sample-collection',
  description: 'This is a sample collection for testing the edit form.',
  cover_image: 'https://via.placeholder.com/300x200',
  layout: 'grid',
  is_public: true,
  is_published: true,
  is_featured: false,
  view_count: 100,
  like_count: 25,
  video_count: 5,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
});

/* =========== METHODS =========== */

const handleCollectionCreated = (collection: Collection) => {
  console.log('Collection created:', collection);
  // In a real app, you might want to refresh a list or navigate to the new collection
};

const handleCollectionUpdated = (collection: Collection) => {
  console.log('Collection updated:', collection);
  // Update the sample collection with the new data
  sampleCollection.value = collection;
};
</script>
