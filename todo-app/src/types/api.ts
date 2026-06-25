import type { AppError } from './errors';
import type { CreateTodoInput, ITodoItem } from './todo';
import type { LoginInput, LoginResponse } from './user';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: AppError;
}

export type ApiResult<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface GetTodosResponse {
  todos: ITodoItem[];
}

export type CreateTodoRequest = CreateTodoInput;

export interface CreateTodoResponse {
  todo: ITodoItem;
}

export interface DeleteTodoRequest {
  id: number;
}

export interface ToggleTodoRequest {
  id: number;
}

export interface DeleteTodoResponse {
  id: number;
}

export type LoginRequest = LoginInput;

export type AuthLoginResponse = LoginResponse;
