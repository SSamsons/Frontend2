import { configureApiClient } from '@/services/apiClient';
import { refreshToken } from '@/services/authService';
import { useUserStore } from '@/stores/userStore';

export default () => {
  configureApiClient({
    getToken: () => {
      const userStore = useUserStore();
      return userStore.token;
    },
    refreshToken: async () => {
      const userStore = useUserStore();
      if (!userStore.token) return null;

      const result = await refreshToken(userStore.token);
      if (!result.success) {
        userStore.logout();
        return null;
      }

      userStore.setToken(result.data.token);
      return result.data.token;
    },
  });
};
