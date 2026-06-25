declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    breadcrumb?: string;
    requiresAuth?: boolean;
    guestOnly?: boolean;
  }
}

export type AppRouteName = 'index' | 'settings' | 'login' | 'not-found';
