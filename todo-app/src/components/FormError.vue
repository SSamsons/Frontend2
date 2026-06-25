<template>
  <div v-if="message" class="text-negative text-caption q-mt-xs" role="alert">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>
