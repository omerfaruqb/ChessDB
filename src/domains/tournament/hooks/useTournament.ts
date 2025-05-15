import { useState, useEffect, useCallback } from 'react';
import tournamentService from '../services/tournamentService';
import { Tournament, TournamentRegistration } from '../models/tournamentModel';
import { 
  CreateTournamentRequest, 
  UpdateTournamentRequest, 
  RegisterPlayerRequest,
  UpdateRegistrationRequest
} from '../types/tournamentTypes';

/**
 * Custom hook for managing chess tournaments
 */
export const useTournament = (tournamentId?: string) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch a single tournament by ID
   */
  const fetchTournament = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await tournamentService.getTournamentById(id);
      setTournament(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch tournament');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all tournaments
   */
  const fetchAllTournaments = useCallback(async (filters?: Record<string, any>) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await tournamentService.getAllTournaments(filters);
      setTournaments(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch tournaments');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new tournament
   */
  const createTournament = useCallback(async (data: CreateTournamentRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await tournamentService.createTournament(data);
      setTournaments(prev => [...prev, result]);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to create tournament');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a tournament
   */
  const updateTournament = useCallback(async (id: string, data: UpdateTournamentRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await tournamentService.updateTournament(id, data);
      
      // Update both the single tournament state and the tournaments array
      setTournament(prev => prev && prev.id === id ? result : prev);
      setTournaments(prev => prev.map(t => t.id === id ? result : t));
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update tournament');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch tournament registrations
   */
  const fetchRegistrations = useCallback(async (targetTournamentId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await tournamentService.getTournamentRegistrations(targetTournamentId);
      setRegistrations(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch registrations');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register player for tournament
   */
  const registerPlayer = useCallback(async (targetTournamentId: string, data: RegisterPlayerRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await tournamentService.registerPlayer(targetTournamentId, data);
      setRegistrations(prev => [...prev, result]);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to register player');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update player registration
   */
  const updateRegistration = useCallback(async (registrationId: string, data: UpdateRegistrationRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await tournamentService.updateRegistration(registrationId, data);
      setRegistrations(prev => prev.map(r => r.id === registrationId ? result : r));
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update registration');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cancel player registration
   */
  const cancelRegistration = useCallback(async (registrationId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await tournamentService.cancelRegistration(registrationId);
      
      if (success) {
        setRegistrations(prev => prev.filter(r => r.id !== registrationId));
      }
      
      return success;
    } catch (err) {
      setError(err.message || 'Failed to cancel registration');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tournament and registrations on mount if tournamentId is provided
  useEffect(() => {
    if (tournamentId) {
      fetchTournament(tournamentId);
      fetchRegistrations(tournamentId);
    }
  }, [tournamentId, fetchTournament, fetchRegistrations]);

  return {
    tournament,
    tournaments,
    registrations,
    loading,
    error,
    fetchTournament,
    fetchAllTournaments,
    createTournament,
    updateTournament,
    fetchRegistrations,
    registerPlayer,
    updateRegistration,
    cancelRegistration
  };
};

export default useTournament;
