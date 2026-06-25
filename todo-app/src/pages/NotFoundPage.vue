<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <div class="text-h1 text-primary">404</div>
      <div class="text-h5 q-mt-md">Страница не найдена</div>
      <q-btn class="q-mt-xl" color="primary" label="На главную" :to="{ name: 'index' }" no-caps />
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>
