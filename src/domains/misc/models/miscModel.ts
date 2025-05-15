/**
 * User settings model
 */
export interface Settings {
  id: string;
  userId: string;
  theme: ThemeOption;
  language: LanguageOption;
  notifications: NotificationSettings;
  updatedAt: Date;
}

/**
 * Theme options
 */
export enum ThemeOption {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
  CHESS = 'chess'
}

/**
 * Language options
 */
export enum LanguageOption {
  ENGLISH = 'en',
  SPANISH = 'es',
  FRENCH = 'fr',
  GERMAN = 'de',
  RUSSIAN = 'ru',
  CHINESE = 'zh'
}

/**
 * Notification settings
 */
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  matchReminders: boolean;
  tournamentUpdates: boolean;
  messages: boolean;
}

/**
 * Notification model
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string; // Match ID, tournament ID, etc.
  createdAt: Date;
}

/**
 * Notification types
 */
export enum NotificationType {
  MATCH_REMINDER = 'match_reminder',
  MATCH_RESULT = 'match_result',
  TOURNAMENT_UPDATE = 'tournament_update',
  TOURNAMENT_INVITATION = 'tournament_invitation',
  SYSTEM = 'system',
  MESSAGE = 'message'
}
