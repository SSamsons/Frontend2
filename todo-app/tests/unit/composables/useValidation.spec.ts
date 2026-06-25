import { describe, expect, it } from 'vitest';
import { loginFormSchema } from '@/utils/validation';
import { useValidation } from '@/composables/useValidation';

describe('useValidation', () => {
  it('validates form data', () => {
    const { validate, errors } = useValidation(loginFormSchema);

    const isValid = validate({ email: 'user@test.com', password: '123456' });
    expect(isValid).toBe(true);
    expect(errors.value).toEqual({});
  });

  it('returns field errors for invalid data', () => {
    const { validate, errors } = useValidation(loginFormSchema);

    const isValid = validate({ email: 'bad', password: '1' });
    expect(isValid).toBe(false);
    expect(errors.value.email).toBeDefined();
    expect(errors.value.password).toBeDefined();
  });
});
