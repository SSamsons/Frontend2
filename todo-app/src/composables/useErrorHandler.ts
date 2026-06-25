import { useUiStore } from '@/stores/uiStore';
import { classifyError, logError, resolveUserMessage } from '@/utils/errorHandling';
import type { AppError } from '@/types/errors';
import type { UiNotification } from '@/types/ui';

export function useErrorHandler() {
  const uiStore = useUiStore();

  function handleError(error: AppError, context?: string, retry?: () => void): void {
    logError(error, context);

    const notification: UiNotification = {
      type: 'negative',
      message: resolveUserMessage(error),
    };

    if (retry && classifyError(error) === 'network') {
      notification.actions = [{ label: 'Повторить', handler: retry }];
    }

    uiStore.showNotification(notification);
  }

  return { handleError };
}
