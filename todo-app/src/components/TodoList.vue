<template>
  <div>
    <q-banner v-if="todos.length === 0" rounded class="bg-grey-2 text-grey-8">
      <template #avatar>
        <q-icon name="info" color="grey-6" />
      </template>
      {{ emptyMessage }}
    </q-banner>

    <q-list v-else bordered separator class="rounded-borders">
      <template v-for="todo in todos" :key="todo.id">
        <q-slide-transition appear :duration="300">
          <div>
            <TodoItem
              :todo="todo"
              @toggle="(id) => emit('toggle', id)"
              @delete="(id) => emit('delete', id)"
            />
          </div>
        </q-slide-transition>
      </template>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import TodoItem from '@/components/TodoItem.vue';
import type { ITodoItem } from '@/types';

withDefaults(
  defineProps<{
    todos: ITodoItem[];
    emptyMessage?: string;
  }>(),
  {
    emptyMessage: 'Список задач пуст.',
  },
);

const emit = defineEmits<{
  toggle: [id: number];
  delete: [id: number];
}>();
</script>
