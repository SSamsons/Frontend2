<template>
  <q-item :class="{ dimmed: todo.completed }">
    <q-item-section avatar>
      <q-checkbox :model-value="todo.completed" @update:model-value="emit('toggle', todo.id)" />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="{ 'text-strike text-grey-6': todo.completed }">
        {{ todo.title }}
      </q-item-label>
      <q-item-label caption :class="{ 'text-grey-5': todo.completed }">
        {{ formattedDate }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-btn
        flat
        round
        dense
        icon="delete"
        color="negative"
        aria-label="Удалить задачу"
        @click="emit('delete', todo.id)"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ITodoItem } from '@/types';

const props = defineProps<{
  todo: ITodoItem;
}>();

const emit = defineEmits<{
  toggle: [id: number];
  delete: [id: number];
}>();

const formattedDate = computed((): string => {
  const date = new Date(props.todo.createdAt);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
});
</script>
