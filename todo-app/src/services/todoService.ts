import { z } from 'zod';
import { apiRequest } from '@/services/apiClient';
import type { ApiResult, CreateTodoRequest, CreateTodoResponse } from '@/types/api';
import type { CreateTodoInput, ITodoItem } from '@/types/todo';

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'Введите название задачи').max(200, 'Слишком длинное название'),
});

export function validateCreateTodo(input: CreateTodoInput): ApiResult<CreateTodoInput> {
  const result = createTodoSchema.safeParse(input);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const field = firstIssue?.path[0]?.toString();
    return {
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: firstIssue?.message ?? 'Некорректные данные',
        ...(field !== undefined ? { field } : {}),
      },
    };
  }

  return { success: true, data: result.data };
}

export function buildTodoItem(id: number, title: string): ITodoItem {
  return {
    id,
    userId: 0,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
    tagIds: [],
  };
}

export function findTodoById(todos: ITodoItem[], id: number): ITodoItem | undefined {
  return todos.find((todo) => todo.id === id);
}

export function createTodoFromRequest(
  id: number,
  userId: number,
  request: CreateTodoRequest,
): ApiResult<CreateTodoResponse> {
  const validation = validateCreateTodo(request);
  if (!validation.success) {
    return validation;
  }

  return {
    success: true,
    data: {
      todo: { ...buildTodoItem(id, validation.data.title), userId },
    },
  };
}

export async function fetchTodos(
  userId: number,
  signal?: AbortSignal,
): Promise<ApiResult<ITodoItem[]>> {
  return apiRequest<ITodoItem[]>({
    url: '/todos',
    method: 'GET',
    params: { userId },
    ...(signal ? { signal } : {}),
  });
}

export async function createTodo(
  userId: number,
  input: CreateTodoInput,
): Promise<ApiResult<ITodoItem>> {
  const validation = validateCreateTodo(input);
  if (!validation.success) {
    return validation;
  }

  return apiRequest<ITodoItem>({
    url: '/todos',
    method: 'POST',
    data: {
      ...buildTodoItem(0, validation.data.title),
      userId,
    },
  });
}

export async function updateTodo(
  id: number,
  patch: Partial<ITodoItem>,
): Promise<ApiResult<ITodoItem>> {
  return apiRequest<ITodoItem>({
    url: `/todos/${id}`,
    method: 'PATCH',
    data: patch,
  });
}

export async function deleteTodo(id: number): Promise<ApiResult<{ id: number }>> {
  const result = await apiRequest<void>({
    url: `/todos/${id}`,
    method: 'DELETE',
  });

  if (!result.success) {
    return result;
  }

  return { success: true, data: { id } };
}
