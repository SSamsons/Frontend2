<template>
  <q-breadcrumbs class="q-mb-md" active-color="primary">
    <q-breadcrumbs-el icon="home" :to="{ name: 'index' }" label="ToDo App" />
    <q-breadcrumbs-el
      v-for="crumb in crumbs"
      :key="crumb.label"
      :label="crumb.label"
      :to="crumb.to"
    />
  </q-breadcrumbs>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const crumbs = computed(() =>
  route.matched
    .filter((record) => record.meta.breadcrumb)
    .map((record) => ({
      label: record.meta.breadcrumb as string,
      to: record.path,
    })),
);
</script>
