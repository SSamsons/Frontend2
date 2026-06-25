import type { ValidationErrors } from '@/utils/validation';

export function getFieldError(errors: ValidationErrors, field: string): string {
  return errors[field] ?? '';
}

export function hasFormErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function clearFieldError(errors: ValidationErrors, field: string): ValidationErrors {
  const next = { ...errors };
  delete next[field];
  return next;
}
