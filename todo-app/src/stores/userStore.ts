import { defineStore, acceptHMRUpdate } from 'pinia';
import { computed, ref } from 'vue';
import { useLocalStorage } from '@/composables/useLocalStorage';
import { login as loginRequest, refreshToken } from '@/services/authService';
import { useErrorHandler } from '@/composables/useErrorHandler';
import type { ApiResult } from '@/types/api';
import type { LoginInput, LoginResponse, StoredUserState, UserSettings, IUser } from '@/types/user';
import { localDemoLogin } from '@/utils/localDemo';

const STORAGE_KEY = 'todo-app-user';

const defaultSettings: UserSettings = {
  language: 'ru',
  notificationsEnabled: true,
};

const defaultState: StoredUserState = {
  user: null,
  token: null,
  settings: defaultSettings,
};

export const useUserStore = defineStore('user', () => {
  const state = useLocalStorage<StoredUserState>(STORAGE_KEY, defaultState);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const { handleError } = useErrorHandler();

  const user = computed(() => state.value.user);
  const token = computed(() => state.value.token);
  const settings = computed(() => state.value.settings);
  const isAuthenticated = computed(() => state.value.token !== null && state.value.user !== null);
  const isLoading = computed(() => loading.value);
  const authError = computed(() => error.value);

  function setToken(nextToken: string): void {
    state.value = { ...state.value, token: nextToken };
  }

  function setAuth(user: IUser, token: string): void {
    state.value = { ...state.value, user, token };
  }

  async function login(input: LoginInput): Promise<ApiResult<LoginResponse>> {
    loading.value = true;
    error.value = null;

    const result = await loginRequest(input);
    loading.value = false;

    if (!result.success) {
      const offline =
        result.error.type === 'NOT_FOUND' ||
        result.error.message.includes('Сеть недоступна') ||
        result.error.message.includes('Не удалось выполнить запрос');
      const local = offline ? localDemoLogin(input.email, input.password) : null;

      if (local) {
        state.value = { ...state.value, user: local.user, token: local.token };
        return { success: true, data: local };
      }

      error.value = result.error.message;
      handleError(result.error, 'userStore.login');
      return result;
    }

    state.value = {
      ...state.value,
      user: result.data.user,
      token: result.data.token,
    };

    return result;
  }

  async function tryRefreshToken(): Promise<ApiResult<{ token: string }>> {
    if (!state.value.token) {
      return {
        success: false,
        error: { type: 'STORAGE_ERROR', message: 'Нет токена для обновления' },
      };
    }

    const result = await refreshToken(state.value.token);
    if (result.success) {
      setToken(result.data.token);
    }
    return result;
  }

  function logout(): void {
    state.value = {
      ...state.value,
      user: null,
      token: null,
    };
    error.value = null;
  }

  function updateSettings(patch: Partial<UserSettings>): void {
    state.value = {
      ...state.value,
      settings: { ...state.value.settings, ...patch },
    };
  }

  return {
    user,
    token,
    settings,
    isAuthenticated,
    isLoading,
    authError,
    login,
    tryRefreshToken,
    logout,
    updateSettings,
    setToken,
    setAuth,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
