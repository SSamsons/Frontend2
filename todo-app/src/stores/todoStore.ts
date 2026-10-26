import { defineStore, acceptHMRUpdate } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useLocalStorage } from '@/composables/useLocalStorage';
import { useErrorHandler } from '@/composables/useErrorHandler';
import {
  createTodo,
  deleteTodo as deleteTodoRequest,
  fetchTodos,
  findTodoById,
  updateTodo,
} from '@/services/todoService';
import { useUserStore } from '@/stores/userStore';
import type { ApiResult } from '@/types/api';
import type { CreateTodoInput, ITodoItem, StoredTodoPrefs, TodoFilterType } from '@/types/todo';
import { isLocalToken } from '@/utils/localDemo';

const PREFS_KEY = 'todo-app-prefs';

const defaultPrefs: StoredTodoPrefs = {
  filter: 'all',
  searchQuery: '',
};

export const useTodoStore = defineStore('todo', () => {
  const prefs = useLocalStorage<StoredTodoPrefs>(PREFS_KEY, defaultPrefs);
  const userStore = useUserStore();
  const { handleError } = useErrorHandler();

  const _todos = ref<ITodoItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const todos = computed(() => _todos.value);

  const filter = computed({
    get: (): TodoFilterType => prefs.value.filter,
    set: (value: TodoFilterType) => {
      prefs.value = { ...prefs.value, filter: value };
    },
  });

  const searchQuery = computed({
    get: (): string => prefs.value.searchQuery,
    set: (value: string) => {
      prefs.value = { ...prefs.value, searchQuery: value };
    },
  });

  const isLoading = computed(() => loading.value);
  const storeError = computed(() => error.value);
  const todoCount = computed(() => _todos.value.length);

  const filteredTodos = computed((): ITodoItem[] => {
    let result = _todos.value;

    if (filter.value === 'active') {
      result = result.filter((todo) => !todo.completed);
    } else if (filter.value === 'completed') {
      result = result.filter((todo) => todo.completed);
    }

    const query = searchQuery.value.trim().toLowerCase();
    if (query) {
      result = result.filter((todo) => todo.title.toLowerCase().includes(query));
    }

    return result;
  });

  const emptyListMessage = computed((): string => {
    if (_todos.value.length === 0) {
      return 'Список задач пуст. Добавьте первую задачу через форму выше.';
    }

    return 'Нет задач по выбранному фильтру или запросу поиска.';
  });

  function setError(message: string | null): void {
    error.value = message;
  }

  function itemsKey(): string {
    return `todo-app-items-${userStore.user?.id ?? 0}`;
  }

  function readLocalTodos(): ITodoItem[] {
    const raw = localStorage.getItem(itemsKey());
    if (!raw) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as ITodoItem[]) : [];
    } catch {
      return [];
    }
  }

  function writeLocalTodos(items: ITodoItem[]): void {
    localStorage.setItem(itemsKey(), JSON.stringify(items));
  }

  function usingLocalApi(): boolean {
    return isLocalToken(userStore.token);
  }

  async function loadTodos(): Promise<ApiResult<ITodoItem[]>> {
    if (!userStore.user) {
      _todos.value = [];
      return {
        success: false,
        error: { type: 'STORAGE_ERROR', message: 'Пользователь не авторизован' },
      };
    }

    if (usingLocalApi()) {
      let items = readLocalTodos();
      if (items.length === 0) {
        items = [
          {
            id: 1,
            userId: userStore.user.id,
            title: 'Открыть список дел',
            completed: false,
            createdAt: new Date().toISOString(),
            tagIds: [],
          },
          {
            id: 2,
            userId: userStore.user.id,
            title: 'Отметить готовую задачу',
            completed: true,
            createdAt: new Date().toISOString(),
            tagIds: [],
          },
        ];
        writeLocalTodos(items);
      }
      _todos.value = items;
      return { success: true, data: items };
    }

    loading.value = true;
    error.value = null;

    const result = await fetchTodos(userStore.user.id);
    loading.value = false;

    if (!result.success) {
      error.value = result.error.message;
      handleError(result.error, 'todoStore.loadTodos', () => {
        void loadTodos();
      });
      return result;
    }

    _todos.value = result.data;
    return result;
  }

  async function addTodo(input: CreateTodoInput): Promise<ApiResult<ITodoItem>> {
    if (!userStore.user) {
      const authError: ApiResult<ITodoItem> = {
        success: false,
        error: { type: 'STORAGE_ERROR', message: 'Требуется авторизация' },
      };
      error.value = authError.error.message;
      handleError(authError.error, 'todoStore.addTodo');
      return authError;
    }

    if (usingLocalApi()) {
      const created: ITodoItem = {
        id: Date.now(),
        userId: userStore.user.id,
        title: input.title,
        completed: false,
        createdAt: new Date().toISOString(),
        tagIds: [],
      };
      _todos.value = [..._todos.value, created];
      writeLocalTodos(_todos.value);
      return { success: true, data: created };
    }

    loading.value = true;
    error.value = null;

    const result = await createTodo(userStore.user.id, input);
    loading.value = false;

    if (!result.success) {
      error.value = result.error.message;
      handleError(result.error, 'todoStore.addTodo');
      return result;
    }

    _todos.value = [..._todos.value, result.data];
    return result;
  }

  async function toggleTodo(id: number): Promise<ApiResult<ITodoItem>> {
    const todo = findTodoById(_todos.value, id);
    if (!todo) {
      const notFound: ApiResult<ITodoItem> = {
        success: false,
        error: { type: 'NOT_FOUND', message: 'Задача не найдена', id },
      };
      error.value = notFound.error.message;
      handleError(notFound.error, 'todoStore.toggleTodo');
      return notFound;
    }

    if (usingLocalApi()) {
      const updated = { ...todo, completed: !todo.completed };
      _todos.value = _todos.value.map((item) => (item.id === id ? updated : item));
      writeLocalTodos(_todos.value);
      return { success: true, data: updated };
    }

    loading.value = true;
    error.value = null;

    const result = await updateTodo(id, { completed: !todo.completed });
    loading.value = false;

    if (!result.success) {
      error.value = result.error.message;
      handleError(result.error, 'todoStore.toggleTodo', () => {
        void toggleTodo(id);
      });
      return result;
    }

    _todos.value = _todos.value.map((item) => (item.id === id ? result.data : item));
    return result;
  }

  async function deleteTodo(id: number): Promise<ApiResult<{ id: number }>> {
    const todo = findTodoById(_todos.value, id);
    if (!todo) {
      const notFound: ApiResult<{ id: number }> = {
        success: false,
        error: { type: 'NOT_FOUND', message: 'Задача не найдена', id },
      };
      error.value = notFound.error.message;
      handleError(notFound.error, 'todoStore.deleteTodo');
      return notFound;
    }

    if (usingLocalApi()) {
      _todos.value = _todos.value.filter((item) => item.id !== id);
      writeLocalTodos(_todos.value);
      return { success: true, data: { id } };
    }

    loading.value = true;
    error.value = null;

    const result = await deleteTodoRequest(id);
    loading.value = false;

    if (!result.success) {
      error.value = result.error.message;
      handleError(result.error, 'todoStore.deleteTodo', () => {
        void deleteTodo(id);
      });
      return result;
    }

    _todos.value = _todos.value.filter((item) => item.id !== id);
    return result;
  }

  watch(
    () => userStore.isAuthenticated,
    (authenticated) => {
      if (authenticated) {
        void loadTodos();
      } else {
        _todos.value = [];
      }
    },
    { immediate: true },
  );

  return {
    todos,
    filter,
    searchQuery,
    filteredTodos,
    emptyListMessage,
    todoCount,
    isLoading,
    storeError,
    loadTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    setError,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTodoStore, import.meta.hot));
}
