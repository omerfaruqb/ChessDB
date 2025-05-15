import { useState, useEffect, useCallback } from 'react';
import expertiseService from '../services/expertiseService';
import { ExpertiseLevel } from '../models/expertiseModel';
import { CreateExpertiseRequest, UpdateExpertiseRequest } from '../types/expertiseTypes';

/**
 * Custom hook for managing chess expertise levels
 */
export const useExpertise = (userId?: string) => {
  const [expertiseLevels, setExpertiseLevels] = useState<ExpertiseLevel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch expertise levels for a user
   */
  const fetchExpertiseLevels = useCallback(async (targetUserId?: string) => {
    if (!targetUserId && !userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await expertiseService.getExpertiseByUserId(targetUserId || userId);
      setExpertiseLevels(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch expertise levels');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Create a new expertise level
   */
  const createExpertise = useCallback(async (data: CreateExpertiseRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await expertiseService.createExpertise(data);
      setExpertiseLevels(prev => [...prev, result]);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to create expertise');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing expertise level
   */
  const updateExpertise = useCallback(async (id: string, data: UpdateExpertiseRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await expertiseService.updateExpertise(id, data);
      setExpertiseLevels(prev => 
        prev.map(level => level.id === id ? result : level)
      );
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update expertise');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch expertise levels on mount if userId is provided
  useEffect(() => {
    if (userId) {
      fetchExpertiseLevels(userId);
    }
  }, [userId, fetchExpertiseLevels]);

  return {
    expertiseLevels,
    loading,
    error,
    fetchExpertiseLevels,
    createExpertise,
    updateExpertise
  };
};

export default useExpertise;
