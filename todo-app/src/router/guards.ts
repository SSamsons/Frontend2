import type { Router } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

export function setupGuards(router: Router): void {
  router.beforeEach((to, _from, next) => {
    const userStore = useUserStore();

    if (to.meta.requiresAuth && !userStore.isAuthenticated) {
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      });
      return;
    }

    if (to.meta.guestOnly && userStore.isAuthenticated) {
      next({ name: 'index' });
      return;
    }

    next();
  });
}
