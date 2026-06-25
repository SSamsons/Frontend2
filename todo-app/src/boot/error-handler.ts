import { logError } from '@/utils/errorHandling';
import { initSentry } from '@/utils/sentry';

export default () => {
  initSentry();

  window.addEventListener('unhandledrejection', (event) => {
    logError(
      { type: 'STORAGE_ERROR', message: 'Необработанная ошибка приложения' },
      'unhandledrejection',
    );
    if (import.meta.env.DEV) {
      console.error(event.reason);
    }
  });

  window.addEventListener('error', (event) => {
    logError({ type: 'STORAGE_ERROR', message: event.message }, 'window.error');
  });
};
