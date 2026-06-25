import type { IUser } from '@/types/user';

export type { ApiResult, ApiSuccessResponse, ApiErrorResponse } from '@/types/api';
export type { AppError } from '@/types/errors';
export type { CreateTodoInput, ITodoItem } from '@/types/todo';
export type { LoginInput, LoginResponse, IUser, UserSettings } from '@/types/user';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  token: string;
  user: IUser;
}

export interface RefreshTokenResponse {
  token: string;
}

export interface ApiRequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  data?: unknown;
  params?: Record<string, string | number>;
  skipAuth?: boolean;
  skipCache?: boolean;
  signal?: AbortSignal;
  retries?: number;
}
