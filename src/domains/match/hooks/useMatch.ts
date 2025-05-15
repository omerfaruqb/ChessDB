import { useState, useEffect, useCallback } from 'react';
import matchService from '../services/matchService';
import { Match, MatchResult } from '../models/matchModel';
import { CreateMatchRequest, UpdateMatchRequest, SubmitResultRequest } from '../types/matchTypes';

/**
 * Custom hook for managing chess matches
 */
export const useMatch = (matchId?: string) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch a single match by ID
   */
  const fetchMatch = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await matchService.getMatchById(id);
      setMatch(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch match');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch matches by player ID
   */
  const fetchMatchesByPlayer = useCallback(async (playerId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await matchService.getMatchesByPlayerId(playerId);
      setMatches(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch player matches');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch matches by tournament ID
   */
  const fetchMatchesByTournament = useCallback(async (tournamentId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await matchService.getMatchesByTournamentId(tournamentId);
      setMatches(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch tournament matches');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new match
   */
  const createMatch = useCallback(async (data: CreateMatchRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await matchService.createMatch(data);
      setMatches(prev => [...prev, result]);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to create match');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a match
   */
  const updateMatch = useCallback(async (id: string, data: UpdateMatchRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await matchService.updateMatch(id, data);
      
      // Update both the single match state and the matches array
      setMatch(prev => prev && prev.id === id ? result : prev);
      setMatches(prev => prev.map(match => match.id === id ? result : match));
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update match');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Submit match result
   */
  const submitResult = useCallback(async (id: string, resultData: SubmitResultRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await matchService.submitResult(id, resultData as MatchResult);
      
      // Update both the single match state and the matches array
      setMatch(prev => prev && prev.id === id ? result : prev);
      setMatches(prev => prev.map(match => match.id === id ? result : match));
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to submit match result');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch match on mount if matchId is provided
  useEffect(() => {
    if (matchId) {
      fetchMatch(matchId);
    }
  }, [matchId, fetchMatch]);

  return {
    match,
    matches,
    loading,
    error,
    fetchMatch,
    fetchMatchesByPlayer,
    fetchMatchesByTournament,
    createMatch,
    updateMatch,
    submitResult
  };
};

export default useMatch;
