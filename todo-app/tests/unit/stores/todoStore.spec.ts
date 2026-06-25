import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import * as todoService from '@/services/todoService';
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
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
  };
});

describe('todoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    vi.mocked(todoService.fetchTodos).mockResolvedValue({ success: true, data: [] });

    const userStore = useUserStore();
    userStore.setAuth({ id: 1, email: 'user@test.com', name: 'User' }, 'token');
  });

  it('loads todos for authenticated user', async () => {
    vi.mocked(todoService.fetchTodos).mockResolvedValue({
      success: true,
      data: [
        {
          id: 1,
          userId: 1,
          title: 'Test',
          completed: false,
          createdAt: '2026-01-01',
          tagIds: [],
        },
      ],
    });

    const store = useTodoStore();
    const result = await store.loadTodos();

    expect(result.success).toBe(true);
    expect(store.todos).toHaveLength(1);
  });

  it('handles validation error on addTodo', async () => {
    vi.mocked(todoService.createTodo).mockResolvedValue({
      success: false,
      error: { type: 'VALIDATION_ERROR', message: 'Введите название задачи' },
    });

    const store = useTodoStore();
    const result = await store.addTodo({ title: '' });

    expect(result.success).toBe(false);
    expect(store.storeError).toBe('Введите название задачи');
  });
});
