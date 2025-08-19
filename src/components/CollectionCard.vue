<template>
  <q-card>
    <q-item to="/collection/{{ props.item.id }}" clickable> {{ props.item.cover_image }}</q-item>
    <q-item>
      <q-item-section>
        <q-item-label class="text-h6">{{ props.item.title }}</q-item-label>
        <q-item-label caption lines="2">{{ props.item.description }}</q-item-label>
        <q-separator class="q-my-sm" />
        <div class="row">
          <span class="text-caption text-grey-7">
            {{ props.item.view_count }} views | {{ props.item.like_count }} likes | Updated: {{ updatedAt(props.item.updated_at) }}
          </span>
        </div>
      </q-item-section>
    </q-item>
    <q-card-actions class="justify-evenly">
      <q-btn flat round :color="props.item.is_liked ? 'red' : 'grey-5'" icon="favorite" size="sm" />
      <q-btn flat round color="accent" icon="bookmark" size="sm" />
      <q-btn flat round color="primary" icon="share" size="sm" />
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { date } from 'quasar';
import type { Collection } from 'src/types/Collection';
/* ============ PROPS ============ */

const props = defineProps<{
item: Collection;
}>()

/* ============ EMITS ============ */

/* ========= LOCAL SCOPE ========= */

/* ============= REFS ============ */

/* ============ HOOKS ============ */

/* =========== METHODS =========== */

const updatedAt = (updatedDate) => {
  return date.formatDate(updatedDate, 'YYYY-MM-DD');
};

</script>

<style scoped lang="scss">

</style>
