<template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :todos="todos"
      :meta="meta"
    ></example-component>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Todo, Meta } from 'components/models';
import ExampleComponent from 'components/ExampleComponent.vue';
import { useAuthStore } from 'stores/auth-store';

const todos = ref<Todo[]>([
  {
    id: 1,
    content: 'ct1',
  },
  {
    id: 2,
    content: 'ct2',
  },
  {
    id: 3,
    content: 'ct3',
  },
  {
    id: 4,
    content: 'ct4',
  },
  {
    id: 5,
    content: 'ct5',
  },
]);

const username = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');

const register = async () => {
  try {
    await useAuthStore().register({
      username: "Mark",
      email: "mark@example.com",
      password: "Secret123",
      password_confirmation: "Secret123",
    });
    // closeDialog();
  } catch (error) {
    console.error('Registration failed:', error);
  }
};


onMounted (async() => {
  await register();
  console.log('register');
})

const meta = ref<Meta>({
  totalCount: 1200,
});
</script>
