<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg full-width" style="max-width: 360px">
      <q-card-section>
        <div class="text-h5 text-center q-mb-md">Вход в ToDo App</div>
        <div class="text-caption text-grey-7 text-center q-mb-lg">Mock: user@test.com / 123456</div>
      </q-card-section>

      <q-card-section>
        <form @submit.prevent="onSubmit">
          <q-input
            v-model="email"
            class="q-mb-sm"
            type="email"
            label="Email"
            outlined
            dense
            :error="!!errors.email"
            @blur="onEmailBlur"
          />
          <FormError v-if="errors.email" :message="errors.email" />

          <q-input
            v-model="password"
            class="q-mb-md"
            type="password"
            label="Пароль"
            outlined
            dense
            :error="!!errors.password"
            @blur="validateField('password', password)"
          />
          <FormError v-if="errors.password" :message="errors.password" />
          <FormError v-if="userStore.authError" :message="userStore.authError" />

          <q-btn
            type="submit"
            color="primary"
            class="full-width"
            label="Войти"
            :loading="userStore.isLoading"
          />
        </form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FormError from '@/components/FormError.vue';
import { useValidation } from '@/composables/useValidation';
import { loginFormSchema, validateEmailUnique } from '@/utils/validation';
import { useUserStore } from '@/stores/userStore';
import { useUiStore } from '@/stores/uiStore';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const uiStore = useUiStore();
const { errors, validate, validateField, validateAsync } = useValidation(loginFormSchema);

const email = ref('user@test.com');
const password = ref('123456');

async function onEmailBlur(): Promise<void> {
  if (!validateField('email', email.value)) return;
  await validateAsync('email', () => validateEmailUnique(email.value));
}

async function onSubmit(): Promise<void> {
  if (!validate({ email: email.value, password: password.value })) return;

  const result = await userStore.login({ email: email.value, password: password.value });
  if (!result.success) return;

  uiStore.showNotification({ type: 'positive', message: 'Добро пожаловать!' });
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/';
  await router.push(redirect);
}
</script>
