import { storeToRefs } from 'pinia';
import { useTodoStore } from '@/stores/todoStore';

const filterOptions = [
  { label: 'Все', value: 'all' as const },
  { label: 'Активные', value: 'active' as const },
  { label: 'Выполненные', value: 'completed' as const },
];

export function useTodoFilter() {
  const todoStore = useTodoStore();

  const { filter, searchQuery, filteredTodos, emptyListMessage } = storeToRefs(todoStore);

  return {
    filter,
    searchQuery,
    filteredTodos,
    filterOptions,
    emptyListMessage,
    loadTodos: todoStore.loadTodos,
    addTodo: todoStore.addTodo,
    toggleTodo: todoStore.toggleTodo,
    deleteTodo: todoStore.deleteTodo,
  };
}
