'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UserType } from '@/domains/user/types';
import { Match } from '@/domains/match/types';
import Link from 'next/link';

export default function MatchesPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Fetch matches based on user role
  useEffect(() => {
    if (!user) return;
    
    const fetchMatches = async () => {
      try {
        setLoading(true);
        
        let endpoint = '';
        
        // Choose endpoint based on user role
        if (user.userType === UserType.PLAYER) {
          endpoint = '/api/matches/player';
        } else if (user.userType === UserType.COACH) {
          endpoint = '/api/matches/coach';
        } else if (user.userType === UserType.ARBITER) {
          endpoint = '/api/matches/arbiter';
        } else {
          endpoint = '/api/matches';
        }
        
        const res = await fetch(endpoint);
        const data = await res.json();
        
        if (data.success) {
          setMatches(data.matches);
        } else {
          setError('Failed to load matches');
        }
      } catch (err) {
        setError('An error occurred while fetching matches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, [user]);
  
  const handleDeleteMatch = async (matchId: number) => {
    if (!confirm('Are you sure you want to delete this match? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleteLoading(matchId.toString());
      setError('');
      setSuccess('');
      
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess('Match deleted successfully');
        // Remove match from state
        setMatches(matches.filter(match => match.match_id !== matchId));
      } else {
        setError(data.message || 'Failed to delete match');
      }
    } catch (err) {
      setError('An error occurred while deleting the match');
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };
  
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }
  
  const isCoach = user?.userType === UserType.COACH;
  const isPlayer = user?.userType === UserType.PLAYER;
  const isArbiter = user?.userType === UserType.ARBITER;
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Matches</h1>
        
        {isCoach && (
          <div className="flex space-x-4">
            <Link
              href="/dashboard/matches/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Match
            </Link>
            <Link
              href="/dashboard/matches/assign"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Assign Players
            </Link>
          </div>
        )}
        
        {isArbiter && (
          <Link
            href="/dashboard/matches/rate"
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Rate Matches
          </Link>
        )}
      </div>
      
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
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {matches.length === 0 ? (
          <p className="p-4 text-gray-500">No matches found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teams</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Players</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result/Rating</th>
                  {isCoach && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matches.map((match) => {
                  const matchDate = new Date(match.date);
                  const isPastMatch = matchDate < new Date();
                  const canDelete = isCoach && !isPastMatch;
                  
                  return (
                    <tr key={match.match_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {matchDate.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        Slot {match.time_slot}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        Team #{match.team1_id} vs Team #{match.team2_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        Hall #{match.hall_id}, Table #{match.table_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {match.white_player_username && <div>White: {match.white_player_username}</div>}
                        {match.black_player_username && <div>Black: {match.black_player_username}</div>}
                        {!match.white_player_username && !match.black_player_username && 
                          <div className="text-gray-400">Players not assigned</div>
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {isPastMatch ? (
                          <>
                            {match.match_result && (
                              <div>
                                {match.match_result === 'white_wins' ? 'White Won' :
                                match.match_result === 'black_wins' ? 'Black Won' : 'Draw'}
                              </div>
                            )}
                            {match.rating !== null ? (
                              <div className="text-sm text-gray-500">Rating: {match.rating}/10</div>
                            ) : (
                              <div className="text-sm text-gray-400">Not rated yet</div>
                            )}
                          </>
                        ) : (
                          <span className="text-yellow-600">Upcoming</span>
                        )}
                      </td>
                      {isCoach && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {canDelete ? (
                            <button
                              onClick={() => handleDeleteMatch(match.match_id)}
                              className="text-red-600 hover:text-red-900 disabled:text-red-300"
                              disabled={deleteLoading === match.match_id.toString()}
                            >
                              {deleteLoading === match.match_id.toString() ? 'Deleting...' : 'Delete'}
                            </button>
                          ) : (
                            <span className="text-gray-400">Cannot delete past matches</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 