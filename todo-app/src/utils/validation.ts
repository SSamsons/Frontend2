import { z } from 'zod';

export const emailSchema = z.string().trim().min(1, 'Введите email').email('Некорректный email');

export const passwordSchema = z
  .string()
  .min(6, 'Пароль должен быть не короче 6 символов')
  .max(64, 'Слишком длинный пароль');

export const todoTitleSchema = z
  .string()
  .trim()
  .min(1, 'Введите название задачи')
  .max(200, 'Слишком длинное название');

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerFormSchema = z.object({
  name: z.string().trim().min(2, 'Введите имя'),
  email: emailSchema,
  password: passwordSchema,
});

export const todoFormSchema = z.object({
  title: todoTitleSchema,
});

export type ValidationErrors = Record<string, string>;

export function getZodFieldErrors(error: z.ZodError): ValidationErrors {
  const errors: ValidationErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0]?.toString() ?? 'form';
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

export async function validateEmailUnique(email: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || '/api'}/users?email=${encodeURIComponent(email)}`,
    );
    if (!response.ok) return null;
    const users = (await response.json()) as Array<{ email: string }>;
    return users.length > 0 ? 'Email уже используется' : null;
  } catch {
    return null;
  }
}
