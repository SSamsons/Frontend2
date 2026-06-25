export type AppTheme = 'light' | 'dark';

export interface StoredUiState {
  theme: AppTheme;
  leftDrawerOpen: boolean;
  settingsPanelVisible: boolean;
}

export interface UiNotification {
  type: 'positive' | 'negative' | 'warning' | 'info';
  message: string;
  actions?: Array<{ label: string; handler: () => void }>;
}
