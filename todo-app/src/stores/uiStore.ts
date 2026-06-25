import { defineStore, acceptHMRUpdate } from 'pinia';
import { computed, ref } from 'vue';
import { Dark } from 'quasar';
import { useLocalStorage } from '@/composables/useLocalStorage';
import type { AppTheme, StoredUiState, UiNotification } from '@/types/ui';

const STORAGE_KEY = 'todo-app-ui';

const defaultState: StoredUiState = {
  theme: 'light',
  leftDrawerOpen: false,
  settingsPanelVisible: true,
};

export const useUiStore = defineStore('ui', () => {
  const state = useLocalStorage<StoredUiState>(STORAGE_KEY, defaultState);
  const pendingNotification = ref<UiNotification | null>(null);

  const theme = computed(() => state.value.theme);
  const leftDrawerOpen = computed({
    get: () => state.value.leftDrawerOpen,
    set: (value: boolean) => {
      state.value = { ...state.value, leftDrawerOpen: value };
    },
  });
  const settingsPanelVisible = computed(() => state.value.settingsPanelVisible);
  const isDarkTheme = computed(() => state.value.theme === 'dark');
  const notification = computed(() => pendingNotification.value);

  function applyTheme(nextTheme: AppTheme): void {
    state.value = { ...state.value, theme: nextTheme };
    Dark.set(nextTheme === 'dark');
  }

  function toggleTheme(): void {
    applyTheme(state.value.theme === 'dark' ? 'light' : 'dark');
  }

  function toggleLeftDrawer(): void {
    state.value = { ...state.value, leftDrawerOpen: !state.value.leftDrawerOpen };
  }

  function setSettingsPanelVisible(value: boolean): void {
    state.value = { ...state.value, settingsPanelVisible: value };
  }

  function showNotification(payload: UiNotification): void {
    pendingNotification.value = payload;
  }

  function clearNotification(): void {
    pendingNotification.value = null;
  }

  applyTheme(state.value.theme);

  return {
    theme,
    leftDrawerOpen,
    settingsPanelVisible,
    isDarkTheme,
    notification,
    applyTheme,
    toggleTheme,
    toggleLeftDrawer,
    setSettingsPanelVisible,
    showNotification,
    clearNotification,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot));
}
