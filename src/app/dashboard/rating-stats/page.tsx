'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UserType } from '@/domains/user/types';

interface RatingStats {
  total_matches: number;
  rated_matches: number;
  average_rating: number | null;
}

export default function RatingStats() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Redirect if not an arbiter
  useEffect(() => {
    if (user && user.userType !== UserType.ARBITER) {
      router.push('/unauthorized');
    }
  }, [user, router]);
  
  // Fetch arbiter's statistics
  useEffect(() => {
    if (!user) return;
    
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Get rating statistics
        const statsRes = await fetch('/api/arbiter/rating-stats');
        const statsData = await statsRes.json();
        
        if (statsData.success) {
          setStats(statsData.stats);
        }
        
        // Get recent rated matches
        const matchesRes = await fetch('/api/arbiter/rated-matches');
        const matchesData = await matchesRes.json();
        
        if (matchesData.success) {
          setRecentMatches(matchesData.matches);
        }
      } catch (err) {
        setError('Failed to load statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);
  
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Rating Statistics</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Total Matches</h2>
          <p className="text-4xl font-bold text-blue-600">{stats?.total_matches || 0}</p>
          <p className="text-gray-500 text-sm mt-2">Matches assigned to you</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Rated Matches</h2>
          <p className="text-4xl font-bold text-green-600">{stats?.rated_matches || 0}</p>
          <p className="text-gray-500 text-sm mt-2">Matches you've rated</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">Average Rating</h2>
          <p className="text-4xl font-bold text-purple-600">
            {stats?.average_rating !== null ? Number(stats?.average_rating).toFixed(1) : '-'}
          </p>
          <p className="text-gray-500 text-sm mt-2">Your average match rating</p>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">Recent Rated Matches</h2>
        
        {recentMatches.length === 0 ? (
          <p className="p-4 text-gray-500">You haven't rated any matches yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teams</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Players</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentMatches.map((match) => (
                  <tr key={match.match_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(match.date).toLocaleDateString()}
                      <div className="text-xs text-gray-500">Slot {match.time_slot}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      Team #{match.team1_id} vs Team #{match.team2_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {match.white_player_username && <div>White: {match.white_player_username}</div>}
                      {match.black_player_username && <div>Black: {match.black_player_username}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {match.match_result === 'white_wins' ? 'White Won' :
                       match.match_result === 'black_wins' ? 'Black Won' : 'Draw'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {match.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h2 className="text-lg font-semibold mb-2">Rating Guidelines</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Ratings should be between 1 (poor) and 10 (excellent)</li>
          <li>Consider factors like adherence to rules, sportsmanship, and match quality</li>
          <li>Be objective and consistent in your ratings</li>
          <li>Remember that your ratings help maintain the integrity of tournaments</li>
        </ul>
      </div>
    </div>
  );
} 