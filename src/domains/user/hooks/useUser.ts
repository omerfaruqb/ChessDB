import { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';
import { User, UserProfile, Achievement } from '../models/userModel';
import { UpdateUserRequest, UpdateProfileRequest, ChangePasswordRequest } from '../types/dbTypes';

/**
 * Custom hook for managing user data and profiles
 */
export const useUser = (userId?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch a single user by ID
   */
  const fetchUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await userService.getUserById(id);
      setUser(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch users by criteria
   */
  const fetchUsersByCriteria = useCallback(async (criteria: Record<string, any>) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await userService.getUsersByCriteria(criteria);
      setUsers(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update user
   */
  const updateUser = useCallback(async (id: string, data: UpdateUserRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.updateUser(id, data);
      
      // Update both the single user state and the users array
      setUser(prev => prev && prev.id === id ? result : prev);
      setUsers(prev => prev.map(u => u.id === id ? result : u));
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch user profile
   */
  const fetchProfile = useCallback(async (targetUserId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await userService.getUserProfile(targetUserId);
      setProfile(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (targetUserId: string, data: UpdateProfileRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.updateUserProfile(targetUserId, data);
      setProfile(result);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Change user password
   */
  const changePassword = useCallback(async (targetUserId: string, data: ChangePasswordRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('New password and confirmation do not match');
      }
      
      const success = await userService.changePassword(
        targetUserId,
        data.currentPassword,
        data.newPassword
      );
      
      return success;
    } catch (err) {
      setError(err.message || 'Failed to change password');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add user achievement
   */
  const addAchievement = useCallback(async (targetUserId: string, achievement: Omit<Achievement, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      // This assumes we'd update the profile with a new achievement
      // In a real implementation, there might be a dedicated API endpoint for this
      if (!profile) {
        throw new Error('Profile not loaded');
      }
      
      const updatedProfile = await userService.updateUserProfile(targetUserId, {
        ...profile,
        achievements: [
          ...(profile.achievements || []),
          { ...achievement, id: `achievement-${Date.now()}` }
        ]
      });
      
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError(err.message || 'Failed to add achievement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile]);

  // Fetch user and profile on mount if userId is provided
  useEffect(() => {
    if (userId) {
      fetchUser(userId);
      fetchProfile(userId);
    }
  }, [userId, fetchUser, fetchProfile]);

  return {
    user,
    users,
    profile,
    loading,
    error,
    fetchUser,
    fetchUsersByCriteria,
    updateUser,
    fetchProfile,
    updateProfile,
    changePassword,
    addAchievement
  };
};

export default useUser;
