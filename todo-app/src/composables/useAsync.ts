import { ref, type Ref } from 'vue';
import type { ApiResult } from '@/types/api';
import type { AppError } from '@/types/errors';

export interface UseAsyncState<T> {
  data: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<AppError | null>;
  execute: (...args: never[]) => Promise<ApiResult<T>>;
  reset: () => void;
}

export function useAsync<T>(
  asyncFn: (...args: never[]) => Promise<ApiResult<T>>,
): UseAsyncState<T> {
  const data = ref<T | null>(null) as Ref<T | null>;
  const loading = ref(false);
  const error = ref<AppError | null>(null);

  async function execute(...args: never[]): Promise<ApiResult<T>> {
    loading.value = true;
    error.value = null;

    const result = await asyncFn(...args);
    loading.value = false;

    if (result.success) {
      data.value = result.data;
    } else {
      error.value = result.error;
    }

    return result;
  }

  function reset(): void {
    data.value = null;
    loading.value = false;
    error.value = null;
  }

  return { data, loading, error, execute, reset };
}
