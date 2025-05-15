import { useState, useEffect, useCallback } from 'react';
import sponsorService from '../services/sponsorService';
import { Sponsor, Sponsorship, EntityType } from '../models/sponsorModel';
import { CreateSponsorRequest, UpdateSponsorRequest, CreateSponsorshipRequest } from '../types/sponsorTypes';

/**
 * Custom hook for managing sponsors
 */
export const useSponsor = (sponsorId?: string) => {
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch a single sponsor by ID
   */
  const fetchSponsor = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await sponsorService.getSponsorById(id);
      setSponsor(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch sponsor');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all sponsors
   */
  const fetchAllSponsors = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await sponsorService.getAllSponsors();
      setSponsors(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch sponsors');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new sponsor
   */
  const createSponsor = useCallback(async (data: CreateSponsorRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await sponsorService.createSponsor(data);
      setSponsors(prev => [...prev, result]);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to create sponsor');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a sponsor
   */
  const updateSponsor = useCallback(async (id: string, data: UpdateSponsorRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await sponsorService.updateSponsor(id, data);
      
      // Update both the single sponsor state and the sponsors array
      setSponsor(prev => prev && prev.id === id ? result : prev);
      setSponsors(prev => prev.map(s => s.id === id ? result : s));
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update sponsor');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch sponsorships by entity
   */
  const fetchSponsorshipsByEntity = useCallback(async (entityId: string, entityType: EntityType) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await sponsorService.getSponsorshipsByEntity(entityId, entityType);
      setSponsorships(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch sponsorships');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch sponsorships by sponsor
   */
  const fetchSponsorshipsBySponsor = useCallback(async (targetSponsorId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await sponsorService.getSponsorshipsBySponsor(targetSponsorId);
      setSponsorships(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch sponsorships');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new sponsorship
   */
  const createSponsorship = useCallback(async (data: CreateSponsorshipRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await sponsorService.createSponsorship(data);
      setSponsorships(prev => [...prev, result]);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to create sponsorship');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch sponsor on mount if sponsorId is provided
  useEffect(() => {
    if (sponsorId) {
      fetchSponsor(sponsorId);
    }
  }, [sponsorId, fetchSponsor]);

  return {
    sponsor,
    sponsors,
    sponsorships,
    loading,
    error,
    fetchSponsor,
    fetchAllSponsors,
    createSponsor,
    updateSponsor,
    fetchSponsorshipsByEntity,
    fetchSponsorshipsBySponsor,
    createSponsorship
  };
};

export default useSponsor;
