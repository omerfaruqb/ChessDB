import { Settings, Notification, ThemeOption, LanguageOption, NotificationSettings } from '../models/miscModel';

/**
 * Response type for settings operations
 */
export interface SettingsResponse {
  data: Settings;
  success: boolean;
  message?: string;
}

/**
 * Response type for notification operations
 */
export interface NotificationResponse {
  data: Notification | Notification[];
  success: boolean;
  message?: string;
  unreadCount?: number;
}

/**
 * Request payload for updating settings
 */
export interface UpdateSettingsRequest {
  theme?: ThemeOption;
  language?: LanguageOption;
  notifications?: Partial<NotificationSettings>;
}
