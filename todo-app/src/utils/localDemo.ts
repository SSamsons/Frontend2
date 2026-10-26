import type { LoginResponse } from '@/types/user';

const DEMO_ACCOUNTS = [
  { id: 1, email: 'user@test.com', password: '123456', name: 'Пользователь' },
  { id: 2, email: 'admin@test.com', password: 'admin123', name: 'Админ' },
] as const;

export function isLocalToken(token: string | null): boolean {
  return token?.startsWith('local-demo-') ?? false;
}

export function localDemoLogin(email: string, password: string): LoginResponse | null {
  const account = DEMO_ACCOUNTS.find(
    (item) => item.email === email.trim().toLowerCase() && item.password === password,
  );

  if (!account) return null;

  return {
    token: `local-demo-${account.id}`,
    user: { id: account.id, email: account.email, name: account.name },
  };
}
