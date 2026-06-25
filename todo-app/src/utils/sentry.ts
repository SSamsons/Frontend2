export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    return;
  }

  if (import.meta.env.DEV) {
    console.info('[Sentry mock] initialized with DSN');
  }
}

export function captureException(error: unknown, context?: string): void {
  if (import.meta.env.DEV) {
    console.error('[Sentry mock]', context ?? 'exception', error);
  }
}

export function captureMessage(message: string): void {
  if (import.meta.env.DEV) {
    console.info('[Sentry mock]', message);
  }
}
