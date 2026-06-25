import { describe, expect, it } from 'vitest';
import { emailSchema, loginFormSchema, todoTitleSchema } from '@/utils/validation';

describe('validation utils', () => {
  it('validates email', () => {
    expect(emailSchema.safeParse('user@test.com').success).toBe(true);
    expect(emailSchema.safeParse('bad-email').success).toBe(false);
  });

  it('validates todo title', () => {
    expect(todoTitleSchema.safeParse('Задача').success).toBe(true);
    expect(todoTitleSchema.safeParse('').success).toBe(false);
  });

  it('validates login form', () => {
    const result = loginFormSchema.safeParse({
      email: 'user@test.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });
});
