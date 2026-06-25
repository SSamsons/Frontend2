import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import * as todoService from '@/services/todoService';
import { useTodoFilter } from '@/composables/useTodoFilter';
import { useTodoStore } from '@/stores/todoStore';
import { useUserStore } from '@/stores/userStore';

vi.mock('@/composables/useErrorHandler', () => ({
  useErrorHandler: () => ({
    handleError: vi.fn(),
  }),
}));

vi.mock('@/services/todoService', async () => {
  const actual =
    await vi.importActual<typeof import('@/services/todoService')>('@/services/todoService');
  return {
    ...actual,
    fetchTodos: vi.fn(),
  };
});

describe('useTodoFilter', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.mocked(todoService.fetchTodos).mockResolvedValue({ success: true, data: [] });

    const userStore = useUserStore();
    userStore.setAuth({ id: 1, email: 'user@test.com', name: 'User' }, 'token');

    vi.mocked(todoService.fetchTodos).mockResolvedValue({
      success: true,
      data: [
        {
          id: 1,
          userId: 1,
          title: 'One',
          completed: false,
          createdAt: '2026-01-01',
          tagIds: [],
        },
        {
          id: 2,
          userId: 1,
          title: 'Two',
          completed: true,
          createdAt: '2026-01-02',
          tagIds: [],
        },
      ],
    });
  });

  it('filters active todos', async () => {
    const store = useTodoStore();
    await store.loadTodos();

    const { filter, filteredTodos } = useTodoFilter();
    filter.value = 'active';

    expect(filteredTodos.value).toHaveLength(1);
    expect(filteredTodos.value[0]?.title).toBe('One');
  });

  it('filters todos by search query', async () => {
    const store = useTodoStore();
    await store.loadTodos();

    const { filter, searchQuery, filteredTodos } = useTodoFilter();
    filter.value = 'all';
    searchQuery.value = 'two';

    expect(filteredTodos.value).toHaveLength(1);
    expect(filteredTodos.value[0]?.title).toBe('Two');
  });

  it('exposes filter options', () => {
    const { filterOptions } = useTodoFilter();
    expect(filterOptions).toHaveLength(3);
  });
});
