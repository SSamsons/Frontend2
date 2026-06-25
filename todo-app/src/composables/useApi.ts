import { useAsync } from '@/composables/useAsync';
import type { ApiResult } from '@/types/api';

export function useApi<T>(request: () => Promise<ApiResult<T>>) {
  const state = useAsync(() => request());

  return {
    ...state,
    reload: () => state.execute(),
  };
}
