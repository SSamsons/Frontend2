import { defineStore } from '#q-app';
import { createPinia } from 'pinia';

export { useTodoStore } from './todoStore';
export { useUserStore } from './userStore';
export { useUiStore } from './uiStore';

export default defineStore(() => {
  const pinia = createPinia();
  return pinia;
});
