import { onScopeDispose, ref, watch, type Ref } from 'vue';

function readStorageValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item !== null ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const storedValue = ref<T>(readStorageValue(key, defaultValue)) as Ref<T>;

  const stopWatch = watch(
    storedValue,
    (newValue) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch {
        // ignore write errors (private mode, quota exceeded)
      }
    },
    { deep: true },
  );

  onScopeDispose(() => {
    stopWatch();
  });

  return storedValue;
}
