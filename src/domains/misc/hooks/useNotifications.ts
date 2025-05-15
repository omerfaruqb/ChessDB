import { useState, useEffect, useCallback } from 'react';
import miscService from '../services/miscService';
import { Notification } from '../models/miscModel';

/**
 * Custom hook for managing user notifications
 */
export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user notifications
   */
  const fetchNotifications = useCallback(async (targetUserId?: string) => {
    if (!targetUserId && !userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await miscService.getUserNotifications(targetUserId || userId);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Mark a notification as read
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await miscService.markNotificationAsRead(notificationId);
      
      // Update notifications list with the read notification
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? result : n)
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    if (!notifications.length) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Create promises for each unread notification
      const promises = notifications
        .filter(n => !n.isRead)
        .map(n => miscService.markNotificationAsRead(n.id));
      
      // Wait for all promises to resolve
      const results = await Promise.all(promises);
      
      // Update notifications
      setNotifications(prev => {
        const newNotifications = [...prev];
        results.forEach(result => {
          const index = newNotifications.findIndex(n => n.id === result.id);
          if (index !== -1) {
            newNotifications[index] = result;
          }
        });
        return newNotifications;
      });
      
      // Set unread count to 0
      setUnreadCount(0);
      
      return results;
    } catch (err) {
      setError(err.message || 'Failed to mark all notifications as read');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [notifications]);

  // Fetch notifications on mount if userId is provided
  useEffect(() => {
    if (userId) {
      fetchNotifications(userId);
    }
  }, [userId, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};

export default useNotifications;
