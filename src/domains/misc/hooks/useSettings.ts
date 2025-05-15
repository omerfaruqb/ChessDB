import { useState, useEffect, useCallback } from 'react';
import miscService from '../services/miscService';
import { Settings, ThemeOption, LanguageOption } from '../models/miscModel';
import { UpdateSettingsRequest } from '../types/miscTypes';

/**
 * Custom hook for managing user settings
 */
export const useSettings = (userId?: string) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user settings
   */
  const fetchSettings = useCallback(async (targetUserId?: string) => {
    if (!targetUserId && !userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await miscService.getUserSettings(targetUserId || userId);
      setSettings(data);
      
      // Apply theme to document
      if (data.theme) {
        applyTheme(data.theme);
      }
      
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch settings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Update user settings
   */
  const updateSettings = useCallback(async (data: UpdateSettingsRequest) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await miscService.updateUserSettings(userId, data);
      setSettings(result);
      
      // Apply theme if it was updated
      if (data.theme) {
        applyTheme(data.theme);
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update settings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Apply theme to document
   */
  const applyTheme = (theme: ThemeOption) => {
    // Handle system theme preference
    if (theme === ThemeOption.SYSTEM) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  };

  // Fetch settings on mount if userId is provided
  useEffect(() => {
    if (userId) {
      fetchSettings(userId);
    }
  }, [userId, fetchSettings]);

  // Listen for system theme changes if using system theme
  useEffect(() => {
    if (settings?.theme === ThemeOption.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings?.theme]);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings
  };
};

export default useSettings;
