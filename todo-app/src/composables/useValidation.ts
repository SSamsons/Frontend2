import { ref } from 'vue';
import type { z } from 'zod';
import { type ZodObject, type ZodRawShape, type ZodTypeAny } from 'zod';
import { getZodFieldErrors, type ValidationErrors } from '@/utils/validation';

export function useValidation<S extends ZodRawShape>(schema: ZodObject<S>) {
  const errors = ref<ValidationErrors>({});

  function validate(data: unknown): data is z.infer<ZodObject<S>> {
    const result = schema.safeParse(data);
    if (result.success) {
      errors.value = {};
      return true;
    }
    errors.value = getZodFieldErrors(result.error);
    return false;
  }

  function validateField(field: keyof S & string, value: unknown): boolean {
    const fieldSchema = schema.shape[field] as ZodTypeAny | undefined;
    if (!fieldSchema) return true;

    const result = fieldSchema.safeParse(value);

    if (result.success) {
      errors.value = { ...errors.value };
      delete errors.value[field];
      return true;
    }

    errors.value = {
      ...errors.value,
      [field]: result.error.issues[0]?.message ?? 'Некорректное значение',
    };
    return false;
  }

  async function validateAsync(
    field: string,
    validator: () => Promise<string | null>,
  ): Promise<boolean> {
    const message = await validator();
    if (message) {
      errors.value = { ...errors.value, [field]: message };
      return false;
    }

    errors.value = { ...errors.value };
    delete errors.value[field];
    return true;
  }

  function clearErrors(): void {
    errors.value = {};
  }

  return {
    errors,
    validate,
    validateField,
    validateAsync,
    clearErrors,
  };
}
