<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Меню" @click="uiStore.toggleLeftDrawer" />

        <q-toolbar-title>ToDo App</q-toolbar-title>

        <q-btn
          flat
          round
          :icon="uiStore.isDarkTheme ? 'light_mode' : 'dark_mode'"
          @click="uiStore.toggleTheme"
        />
        <q-btn flat round icon="logout" aria-label="Выйти" @click="onLogout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Навигация</q-item-label>

        <q-item clickable v-ripple :to="{ name: 'index' }" exact>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Главная</q-item-label>
            <q-item-label caption>Список задач</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple :to="{ name: 'settings' }">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Настройки</q-item-label>
            <q-item-label caption>Профиль и тема</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator class="q-my-md" />

      <q-item v-if="userStore.user">
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" icon="person" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ userStore.user.name }}</q-item-label>
          <q-item-label caption>{{ userStore.user.email }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <div class="q-pa-md">
        <AppBreadcrumbs />
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import { useTodoStore } from '@/stores/todoStore';
import { useUiStore } from '@/stores/uiStore';
import { useUserStore } from '@/stores/userStore';

const $q = useQuasar();
const router = useRouter();
const uiStore = useUiStore();
const userStore = useUserStore();
const todoStore = useTodoStore();

const { leftDrawerOpen } = storeToRefs(uiStore);

const drawerOpen = computed({
  get: () => leftDrawerOpen.value,
  set: (value: boolean) => {
    uiStore.leftDrawerOpen = value;
  },
});

watch(
  () => uiStore.notification,
  (payload) => {
    if (!payload) return;
    const notifyOptions: {
      type: typeof payload.type;
      message: string;
      actions?: Array<{ label: string; color: 'white'; handler: () => void }>;
    } = {
      type: payload.type,
      message: payload.message,
    };

    if (payload.actions?.length) {
      notifyOptions.actions = payload.actions.map((action) => ({
        label: action.label,
        color: 'white' as const,
        handler: action.handler,
      }));
    }

    $q.notify(notifyOptions);
    uiStore.clearNotification();
  },
);

function onLogout(): void {
  userStore.logout();
  todoStore.setError(null);
  void router.push({ name: 'login' });
}
</script>
