'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UserType } from '@/domains/user/types';
import { Match } from '@/domains/match/types';

export default function RateMatches() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string>('');
  const [rating, setRating] = useState<string>('5');
  const [loading, setLoading] = useState(false);
  const [rateLoading, setRateLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Redirect if not an arbiter
  useEffect(() => {
    if (user && user.userType !== UserType.ARBITER) {
      router.push('/unauthorized');
    }
  }, [user, router]);
  
  // Fetch arbiter's assigned matches
  useEffect(() => {
    if (!user) return;
    
    const fetchMatches = async () => {
      try {
        setLoading(true);
        
        const res = await fetch('/api/matches/arbiter');
        const data = await res.json();
        
        if (data.success) {
          setMatches(data.matches);
        } else {
          setError('Failed to load matches data');
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
  
  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMatch || !rating) {
      setError('Please select a match and provide a rating');
      return;
    }
    
    try {
      setRateLoading(true);
      setError('');
      setSuccess('');
      
      const res = await fetch(`/api/matches/${selectedMatch}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: parseInt(rating)
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess('Match rated successfully');
        
        // Update local matches data
        setMatches(prevMatches => 
          prevMatches.map(match => 
            match.match_id.toString() === selectedMatch 
              ? { ...match, rating: parseInt(rating) } 
              : match
          )
        );
        
        // Reset form
        setSelectedMatch('');
        setRating('5');
      } else {
        setError(data.message || 'Failed to rate match');
      }
    } catch (err) {
      setError('An error occurred while rating the match');
      console.error(err);
    } finally {
      setRateLoading(false);
    }
  };
  
  // Get matches that can be rated (past date and not yet rated)
  const getRatableMatches = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return matches.filter(match => {
      const matchDate = new Date(match.date);
      matchDate.setHours(0, 0, 0, 0);
      
      return matchDate < today && match.rating === null;
    });
  };
  
  const ratableMatches = getRatableMatches();
  
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Rate Matches</h1>
      
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
      
      {ratableMatches.length === 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">You don't have any matches that need rating at this time. Only past matches that haven't been rated yet will appear here.</p>
        </div>
      )}
      
      {ratableMatches.length > 0 && (
        <form onSubmit={handleSubmitRating} className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Submit Match Rating</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Match</label>
              <select
                value={selectedMatch}
                onChange={(e) => setSelectedMatch(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select a match to rate</option>
                {ratableMatches.map((match) => (
                  <option key={match.match_id} value={match.match_id}>
                    {new Date(match.date).toLocaleDateString()} - Team #{match.team1_id} vs Team #{match.team2_id}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
              <p className="text-sm text-gray-500 mt-1">1 = Poor, 10 = Excellent</p>
            </div>
            
            <div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                disabled={rateLoading || !selectedMatch || !rating}
              >
                {rateLoading ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </form>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">Your Assigned Matches</h2>
        
        {matches.length === 0 ? (
          <p className="p-4 text-gray-500">You don't have any assigned matches.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teams</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Players</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matches.map((match) => {
                  const matchDate = new Date(match.date);
                  const isPastMatch = matchDate < new Date();
                  
                  return (
                    <tr key={match.match_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {matchDate.toLocaleDateString()}
                        <div className="text-xs text-gray-500">Slot {match.time_slot}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        Team #{match.team1_id} vs Team #{match.team2_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {match.white_player_username && <div>White: {match.white_player_username}</div>}
                        {match.black_player_username && <div>Black: {match.black_player_username}</div>}
                        {!match.white_player_username && !match.black_player_username && 
                          <div className="text-gray-400">Players not assigned</div>
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {match.match_result ? (
                          match.match_result === 'white_wins' ? 'White Won' :
                          match.match_result === 'black_wins' ? 'Black Won' : 'Draw'
                        ) : (
                          <span className="text-gray-400">Not played yet</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {match.rating !== null ? match.rating : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {!isPastMatch ? (
                          <span className="text-yellow-600">Upcoming</span>
                        ) : match.rating !== null ? (
                          <span className="text-green-600">Rated</span>
                        ) : (
                          <span className="text-red-600">Needs Rating</span>
                        )}
                      </td>
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