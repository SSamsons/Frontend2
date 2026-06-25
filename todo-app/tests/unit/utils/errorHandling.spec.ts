import { describe, expect, it } from 'vitest';
import { classifyError, getUserMessage, resolveUserMessage } from '@/utils/errorHandling';

describe('errorHandling utils', () => {
  it('classifies validation errors', () => {
    expect(classifyError({ type: 'VALIDATION_ERROR', message: 'Некорректные данные' })).toBe(
      'validation',
    );
  });

  it('returns user friendly network message', () => {
    const message = getUserMessage({
      type: 'STORAGE_ERROR',
      message: 'Сеть недоступна',
    });
    expect(message).toContain('сет');
  });

  it('resolves business error message', () => {
    const message = resolveUserMessage({
      type: 'NOT_FOUND',
      message: 'Задача не найдена',
      id: 1,
    });
    expect(message).toBe('Задача не найдена');
  });
});
