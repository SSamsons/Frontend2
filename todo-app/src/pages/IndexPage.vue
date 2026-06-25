<template>
  <q-page>
    <div class="text-h4 q-mb-md">Мои задачи</div>

    <q-linear-progress v-if="isLoading" indeterminate class="q-mb-md" />

    <q-banner v-if="storeError" class="bg-red-1 text-negative q-mb-md" rounded>
      {{ storeError }}
    </q-banner>

    <TodoForm />

    <q-input v-model="searchQuery" class="q-mb-md" outlined dense clearable label="Поиск задач">
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <q-btn-toggle
      v-model="filter"
      class="q-mb-md"
      spread
      no-caps
      toggle-color="primary"
      :options="filterToggleOptions"
    />

    <TodoList
      :todos="filteredTodos"
      :empty-message="emptyListMessage"
      @toggle="onToggle"
      @delete="onDelete"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import TodoForm from '@/components/TodoForm.vue';
import TodoList from '@/components/TodoList.vue';
import { useTodoFilter } from '@/composables/useTodoFilter';
import { useTodoStore } from '@/stores/todoStore';

const todoStore = useTodoStore();
const { filter, searchQuery, filteredTodos, filterOptions, emptyListMessage } = useTodoFilter();
const { isLoading, storeError } = storeToRefs(todoStore);

const filterToggleOptions = computed(() =>
  filterOptions.map((option) => ({
    label: option.label,
    value: option.value,
  })),
);

function onToggle(id: number): void {
  void todoStore.toggleTodo(id);
}

function onDelete(id: number): void {
  void todoStore.deleteTodo(id);
}
</script>
