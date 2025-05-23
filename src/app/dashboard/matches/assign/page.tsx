'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UserType } from '@/domains/user/types';
import { Match } from '@/domains/match/types';

export default function AssignPlayers() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [matches, setMatches] = useState<(Match & { team_name?: string })[]>([]);
  const [teamPlayers, setTeamPlayers] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Redirect if not a coach
  useEffect(() => {
    if (user && user.userType !== UserType.COACH) {
      router.push('/unauthorized');
    }
  }, [user, router]);
  
  // Fetch coach's matches and team players
  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get coach's matches
        const matchesRes = await fetch('/api/matches/coach');
        const matchesData = await matchesRes.json();
        if (matchesData.success) {
          setMatches(matchesData.matches);
        }
        
        // Get coach's team players
        const playersRes = await fetch('/api/teams/coach/players');
        const playersData = await playersRes.json();
        if (playersData.success) {
          setTeamPlayers(playersData.players);
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
  
  const handleAssignPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMatch || !selectedPlayer) {
      setError('Please select both a match and a player');
      return;
    }
    
    try {
      setAssignLoading(true);
      setError('');
      setSuccess('');
      
      const res = await fetch(`/api/matches/${selectedMatch}/assign-player`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_username: selectedPlayer
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess(`Player successfully assigned to the match`);
        
        // Refresh matches list
        const matchesRes = await fetch('/api/matches/coach');
        const matchesData = await matchesRes.json();
        if (matchesData.success) {
          setMatches(matchesData.matches);
        }
        
        // Reset selections
        setSelectedMatch('');
        setSelectedPlayer('');
      } else {
        setError(data.message || 'Failed to assign player');
      }
    } catch (err) {
      setError('An error occurred while assigning player');
      console.error(err);
    } finally {
      setAssignLoading(false);
    }
  };
  
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }
  
  const getMatchStatus = (match: Match) => {
    if (match.white_player_username && match.black_player_username) {
      return 'Both players assigned';
    }
    
    if (match.white_player_username || match.black_player_username) {
      return 'Waiting for opponent';
    }
    
    return 'No players assigned';
  };
  
  const getPendingMatches = () => {
    return matches.filter(match => {
      // Get matches where player assignment is still needed for this coach's team
      const isTeam1Match = match.team1_id === matches[0]?.team1_id; // Assuming first match's team1 is coach's team
      
      if (isTeam1Match) {
        return !match.white_player_username;
      } else {
        return !match.black_player_username;
      }
    });
  };
  
  const pendingMatches = getPendingMatches();
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Assign Players to Matches</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700">{success}</p>
        </div>
      )}
      
      {teamPlayers.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700">You don't have any players in your team yet.</p>
        </div>
      )}
      
      {pendingMatches.length === 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">All your matches have players assigned. Create new matches or wait for opponent teams to create matches with your team.</p>
        </div>
      )}
      
      {pendingMatches.length > 0 && teamPlayers.length > 0 && (
        <form onSubmit={handleAssignPlayer} className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Assign Player to Match</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Match</label>
              <select
                value={selectedMatch}
                onChange={(e) => setSelectedMatch(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select a match</option>
                {pendingMatches.map((match) => (
                  <option key={match.match_id} value={match.match_id}>
                    {new Date(match.date).toLocaleDateString()} - vs {match.team_name || `Team #${match.team2_id}`}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Player</label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select a player</option>
                {teamPlayers.map((player) => (
                  <option key={player.username} value={player.username}>
                    {player.name} {player.surname} (ELO: {player.eloRating})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                disabled={assignLoading || !selectedMatch || !selectedPlayer}
              >
                {assignLoading ? 'Assigning...' : 'Assign Player'}
              </button>
            </div>
          </div>
        </form>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">All Your Matches</h2>
        
        {matches.length === 0 ? (
          <p className="p-4 text-gray-500">You haven't created any matches yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opponent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hall & Table</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Players</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matches.map((match) => (
                  <tr key={match.match_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(match.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Slot {match.time_slot}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{match.team_name || `Team #${match.team2_id}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Hall #{match.hall_id}, Table #{match.table_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getMatchStatus(match)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {match.white_player_username && <div>White: {match.white_player_username}</div>}
                      {match.black_player_username && <div>Black: {match.black_player_username}</div>}
                      {!match.white_player_username && !match.black_player_username && <div className="text-gray-400">None assigned</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 