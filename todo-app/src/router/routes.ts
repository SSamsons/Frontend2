import type { RouteRecordRaw } from 'vue-router';
import '@/types/router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('@/pages/IndexPage.vue'),
        meta: { title: 'Мои задачи', breadcrumb: 'Главная' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/pages/SettingsPage.vue'),
        meta: { title: 'Настройки', breadcrumb: 'Настройки' },
      },
    ],
  },

  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: { guestOnly: true },
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/pages/LoginPage.vue'),
        meta: { title: 'Вход', breadcrumb: 'Вход' },
      },
    ],
  },

  {
    path: '/404',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: 'Страница не найдена', breadcrumb: '404' },
  },

  {
    path: '/:catchAll(.*)*',
    redirect: '/404',
  },
];

export default routes;
