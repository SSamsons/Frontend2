import type { AppError } from '@/types/errors';

export type ErrorCategory = 'network' | 'validation' | 'business' | 'unknown';

const USER_MESSAGES: Record<ErrorCategory, string> = {
  network: 'Проблема с сетью. Попробуйте ещё раз.',
  validation: 'Проверьте правильность введённых данных.',
  business: 'Не удалось выполнить операцию.',
  unknown: 'Произошла непредвиденная ошибка.',
};

export function classifyError(error: AppError): ErrorCategory {
  if (error.type === 'VALIDATION_ERROR') return 'validation';
  if (error.type === 'NOT_FOUND') return 'business';
  if (error.type === 'STORAGE_ERROR') {
    if (error.message.toLowerCase().includes('сеть')) return 'network';
    return 'network';
  }
  return 'unknown';
}

export function getUserMessage(error: AppError): string {
  if (error.type === 'VALIDATION_ERROR' || error.type === 'NOT_FOUND') {
    return error.message;
  }

  const category = classifyError(error);
  return USER_MESSAGES[category];
}

export function logError(error: AppError, context?: string): void {
  if (import.meta.env.DEV) {
    const prefix = context ? `[${context}]` : '[AppError]';
    console.error(prefix, error);
  }
}

export interface ErrorHandlerStrategy {
  canHandle(error: AppError): boolean;
  handle(error: AppError): string;
}

export class ValidationErrorStrategy implements ErrorHandlerStrategy {
  canHandle(error: AppError): boolean {
    return error.type === 'VALIDATION_ERROR';
  }

  handle(error: AppError): string {
    return error.message;
  }
}

export class NetworkErrorStrategy implements ErrorHandlerStrategy {
  canHandle(error: AppError): boolean {
    return error.type === 'STORAGE_ERROR' && classifyError(error) === 'network';
  }

  handle(): string {
    return USER_MESSAGES.network;
  }
}

export class BusinessErrorStrategy implements ErrorHandlerStrategy {
  canHandle(error: AppError): boolean {
    return error.type === 'NOT_FOUND';
  }

  handle(error: AppError): string {
    return error.message;
  }
}

const strategies: ErrorHandlerStrategy[] = [
  new ValidationErrorStrategy(),
  new NetworkErrorStrategy(),
  new BusinessErrorStrategy(),
];

export function resolveUserMessage(error: AppError): string {
  const strategy = strategies.find((item) => item.canHandle(error));
  return strategy ? strategy.handle(error) : getUserMessage(error);
}
