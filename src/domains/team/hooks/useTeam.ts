import { useState, useEffect, useCallback } from 'react';
import teamService from '../services/teamService';
import { Team, TeamMember } from '../models/teamModel';
import { CreateTeamRequest, UpdateTeamRequest, AddTeamMemberRequest } from '../types/teamTypes';

/**
 * Custom hook for managing chess teams
 */
export const useTeam = (teamId?: string) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch a single team by ID
   */
  const fetchTeam = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await teamService.getTeamById(id);
      setTeam(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch team');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all teams
   */
  const fetchAllTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await teamService.getAllTeams();
      setTeams(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch teams');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch teams by player ID
   */
  const fetchTeamsByPlayer = useCallback(async (playerId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await teamService.getTeamsByPlayer(playerId);
      setTeams(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch player teams');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new team
   */
  const createTeam = useCallback(async (data: CreateTeamRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await teamService.createTeam(data);
      setTeams(prev => [...prev, result]);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to create team');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update a team
   */
  const updateTeam = useCallback(async (id: string, data: UpdateTeamRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await teamService.updateTeam(id, data);
      
      // Update both the single team state and the teams array
      setTeam(prev => prev && prev.id === id ? result : prev);
      setTeams(prev => prev.map(t => t.id === id ? result : t));
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update team');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch team members
   */
  const fetchTeamMembers = useCallback(async (targetTeamId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await teamService.getTeamMembers(targetTeamId);
      setTeamMembers(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch team members');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add a team member
   */
  const addTeamMember = useCallback(async (targetTeamId: string, data: AddTeamMemberRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await teamService.addTeamMember(targetTeamId, data);
      setTeamMembers(prev => [...prev, result]);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to add team member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Remove a team member
   */
  const removeTeamMember = useCallback(async (targetTeamId: string, playerId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await teamService.removeTeamMember(targetTeamId, playerId);
      
      if (success) {
        setTeamMembers(prev => prev.filter(member => 
          !(member.teamId === targetTeamId && member.playerId === playerId)
        ));
      }
      
      return success;
    } catch (err) {
      setError(err.message || 'Failed to remove team member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch team and team members on mount if teamId is provided
  useEffect(() => {
    if (teamId) {
      fetchTeam(teamId);
      fetchTeamMembers(teamId);
    }
  }, [teamId, fetchTeam, fetchTeamMembers]);

  return {
    team,
    teams,
    teamMembers,
    loading,
    error,
    fetchTeam,
    fetchAllTeams,
    fetchTeamsByPlayer,
    createTeam,
    updateTeam,
    fetchTeamMembers,
    addTeamMember,
    removeTeamMember
  };
};

export default useTeam;
