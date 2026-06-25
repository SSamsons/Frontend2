<template>
  <q-page>
    <div class="text-h4 q-mb-md">Настройки</div>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Профиль</div>
        <div v-if="user" class="text-body2">{{ user.name }} ({{ user.email }})</div>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Тема приложения</div>
        <q-btn-toggle
          :model-value="theme"
          spread
          no-caps
          toggle-color="primary"
          :options="themeOptions"
          @update:model-value="uiStore.applyTheme($event as AppTheme)"
        />
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Уведомления</div>
        <q-toggle
          :model-value="settings.notificationsEnabled"
          label="Показывать уведомления"
          @update:model-value="userStore.updateSettings({ notificationsEnabled: $event })"
        />
      </q-card-section>
    </q-card>

    <q-btn class="q-mt-lg" color="negative" outline icon="logout" label="Выйти" @click="onLogout" />
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUiStore } from '@/stores/uiStore';
import { useUserStore } from '@/stores/userStore';
import type { AppTheme } from '@/types';

const router = useRouter();
const uiStore = useUiStore();
const userStore = useUserStore();

const { user, settings } = storeToRefs(userStore);
const { theme } = storeToRefs(uiStore);

const themeOptions = [
  { label: 'Светлая', value: 'light' },
  { label: 'Тёмная', value: 'dark' },
];

function onLogout(): void {
  userStore.logout();
  void router.push({ name: 'login' });
}
</script>
