'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UserType } from '@/domains/user/types';

export default function CreateMatch() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('1');
  const [hallId, setHallId] = useState('');
  const [tableId, setTableId] = useState('');
  const [team2Id, setTeam2Id] = useState('');
  const [arbiterUsername, setArbiterUsername] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [halls, setHalls] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [arbiters, setArbiters] = useState<any[]>([]);
  const [userTeam, setUserTeam] = useState<any>(null);
  
  // Redirect if not a coach
  useEffect(() => {
    if (user && user.userType !== UserType.COACH) {
      router.push('/unauthorized');
    }
  }, [user, router]);
  
  // Fetch initial data
  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get coach's team
        const teamRes = await fetch('/api/teams/coach');
        const teamData = await teamRes.json();
        if (teamData.success) {
          setUserTeam(teamData.team);
        }
        
        // Get halls
        const hallsRes = await fetch('/api/halls');
        const hallsData = await hallsRes.json();
        if (hallsData.success) {
          setHalls(hallsData.halls);
        }
        
        // Get teams (excluding coach's team)
        const teamsRes = await fetch('/api/teams');
        const teamsData = await teamsRes.json();
        if (teamsData.success) {
          setTeams(teamsData.teams.filter((team: any) => team.team_id !== teamData.team?.team_id));
        }
        
        // Get arbiters
        const arbitersRes = await fetch('/api/users/arbiters');
        const arbitersData = await arbitersRes.json();
        if (arbitersData.success) {
          setArbiters(arbitersData.arbiters);
        }
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  // Get tables for selected hall
  useEffect(() => {
    if (!hallId) {
      setTables([]);
      return;
    }
    
    const fetchTables = async () => {
      try {
        const res = await fetch(`/api/halls/${hallId}/tables`);
        const data = await res.json();
        if (data.success) {
          setTables(data.tables);
        } else {
          setError('Failed to load tables');
        }
      } catch (err) {
        setError('Failed to load tables');
        console.error(err);
      }
    };
    
    fetchTables();
  }, [hallId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userTeam) {
      setError('You must be assigned to a team to create a match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          time_slot: parseInt(timeSlot),
          hall_id: parseInt(hallId),
          table_id: parseInt(tableId),
          team1_id: userTeam.team_id,
          team2_id: parseInt(team2Id),
          arbiter_username: arbiterUsername
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        router.push('/dashboard/matches');
      } else {
        setError(data.message || 'Failed to create match');
      }
    } catch (err) {
      setError('An error occurred while creating the match');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !halls.length) {
    return <div className="p-4">Loading...</div>;
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Match</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {!userTeam && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700">You are not currently assigned to any team. Contact a database manager to be assigned to a team.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Match Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            min={new Date().toISOString().split('T')[0]} // Only future dates
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="1">Slot 1 (Morning)</option>
            <option value="2">Slot 2 (Afternoon)</option>
            <option value="3">Slot 3 (Evening)</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">Note: Each match takes 2 consecutive time slots</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hall</label>
          <select
            value={hallId}
            onChange={(e) => setHallId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select a hall</option>
            {halls.map((hall) => (
              <option key={hall.hall_id} value={hall.hall_id}>
                {hall.hall_name} ({hall.hall_country}, Capacity: {hall.hall_capacity})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Table</label>
          <select
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={!hallId}
          >
            <option value="">Select a table</option>
            {tables.map((table) => (
              <option key={table.table_id} value={table.table_id}>
                Table {table.table_id}
              </option>
            ))}
          </select>
          {!hallId && <p className="text-sm text-gray-500 mt-1">Select a hall first</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Team</label>
          <input
            type="text"
            value={userTeam?.team_name || 'Not assigned to a team'}
            className="w-full px-3 py-2 border rounded-md bg-gray-50"
            disabled
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Opponent Team</label>
          <select
            value={team2Id}
            onChange={(e) => setTeam2Id(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
            disabled={!userTeam}
          >
            <option value="">Select opponent team</option>
            {teams.map((team) => (
              <option key={team.team_id} value={team.team_id}>
                {team.team_name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Arbiter</label>
          <select
            value={arbiterUsername}
            onChange={(e) => setArbiterUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select an arbiter</option>
            {arbiters.map((arbiter) => (
              <option key={arbiter.username} value={arbiter.username}>
                {arbiter.name} {arbiter.surname} (Experience: {arbiter.experienceLevel})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            disabled={loading || !userTeam}
          >
            {loading ? 'Creating...' : 'Create Match'}
          </button>
        </div>
      </form>
    </div>
  );
} 