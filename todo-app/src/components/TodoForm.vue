<template>
  <form class="q-mb-md" @submit.prevent="onSubmit">
    <div class="row q-col-gutter-sm items-start">
      <div class="col">
        <q-input
          v-model="title"
          label="Новая задача"
          outlined
          dense
          :error="!!errors.title"
          @blur="validateField('title', title)"
        />
        <FormError v-if="errors.title" :message="errors.title" />
      </div>
      <div class="col-auto">
        <q-btn
          type="submit"
          color="primary"
          label="Добавить"
          icon="add"
          :disable="!title.trim()"
          :loading="isLoading"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import FormError from '@/components/FormError.vue';
import { useValidation } from '@/composables/useValidation';
import { todoFormSchema } from '@/utils/validation';
import { useTodoStore } from '@/stores/todoStore';
import { useUiStore } from '@/stores/uiStore';

const todoStore = useTodoStore();
const uiStore = useUiStore();
const { isLoading } = storeToRefs(todoStore);
const { errors, validate, validateField, clearErrors } = useValidation(todoFormSchema);

const title = ref<string>('');

async function onSubmit(): Promise<void> {
  clearErrors();
  if (!validate({ title: title.value })) return;

  const result = await todoStore.addTodo({ title: title.value });
  if (result.success) {
    title.value = '';
    uiStore.showNotification({ type: 'positive', message: 'Задача добавлена' });
  }
}
</script>
