import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiResult } from '@/types/api';
import type { AppError } from '@/types/errors';
import type { ApiRequestConfig } from '@/services/types';

const CACHE_TTL_MS = 30_000;

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const responseCache = new Map<string, CacheEntry>();

let tokenGetter: () => string | null = () => null;
let tokenRefresher: () => Promise<string | null> = () => Promise.resolve(null);

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function configureApiClient(options: {
  getToken: () => string | null;
  refreshToken: () => Promise<string | null>;
}): void {
  tokenGetter = options.getToken;
  tokenRefresher = options.refreshToken;
}

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenGetter();
  if (token && !config.headers['X-Skip-Auth']) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await tokenRefresher();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return http(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

function getCacheKey(config: ApiRequestConfig): string {
  return `${config.method ?? 'GET'}:${config.url}:${JSON.stringify(config.params ?? {})}`;
}

function mapAxiosError(error: AxiosError<{ message?: string }>): AppError {
  const message = error.response?.data?.message ?? error.message;
  const status = error.response?.status;

  if (status === 401) {
    return { type: 'STORAGE_ERROR', message: 'Требуется авторизация' };
  }

  if (status === 404) {
    return { type: 'NOT_FOUND', message, id: 0 };
  }

  if (status === 400 || status === 422) {
    return { type: 'VALIDATION_ERROR', message };
  }

  if (!error.response) {
    return { type: 'STORAGE_ERROR', message: 'Сеть недоступна. Проверьте подключение.' };
  }

  return { type: 'STORAGE_ERROR', message };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function apiRequest<T>(config: ApiRequestConfig): Promise<ApiResult<T>> {
  const method = config.method ?? 'GET';
  const retries = config.retries ?? 2;
  const cacheKey = getCacheKey(config);

  if (method === 'GET' && !config.skipCache) {
    const cached = responseCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return { success: true, data: cached.data as T };
    }
  }

  let attempt = 0;

  while (attempt <= retries) {
    try {
      const requestConfig: Record<string, unknown> = {
        url: config.url,
        method,
        params: config.params,
        signal: config.signal,
        data: config.data,
      };

      if (config.skipAuth) {
        requestConfig.headers = { 'X-Skip-Auth': 'true' };
      }

      const response = await http.request<T>(requestConfig as AxiosRequestConfig);

      if (method === 'GET' && !config.skipCache) {
        responseCache.set(cacheKey, {
          data: response.data,
          expiresAt: Date.now() + CACHE_TTL_MS,
        });
      }

      if (method !== 'GET') {
        invalidateCacheByPrefix('/todos');
      }

      return { success: true, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const isNetworkError = !axiosError.response;

      if (isNetworkError && attempt < retries) {
        attempt += 1;
        await sleep(300 * attempt);
        continue;
      }

      return { success: false, error: mapAxiosError(axiosError) };
    }
  }

  return {
    success: false,
    error: { type: 'STORAGE_ERROR', message: 'Не удалось выполнить запрос' },
  };
}

export function invalidateCacheByPrefix(urlPrefix: string): void {
  for (const key of responseCache.keys()) {
    if (key.includes(urlPrefix)) {
      responseCache.delete(key);
    }
  }
}

export function clearApiCache(): void {
  responseCache.clear();
}

export function createAbortController(): AbortController {
  return new AbortController();
}
