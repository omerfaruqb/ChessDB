'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UserType } from '@/domains/user/types';

interface CoPlayerStats {
  username: string;
  name: string;
  surname: string;
  eloRating: number;
  matches_played: number;
}

interface MostPlayedStats {
  username: string;
  name: string;
  surname: string;
  eloRating: number;
  matches_played: number;
}

export default function CoPlayerStats() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [coPlayers, setCoPlayers] = useState<CoPlayerStats[]>([]);
  const [mostPlayedWith, setMostPlayedWith] = useState<MostPlayedStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Redirect if not a player
  useEffect(() => {
    if (user && user.userType !== UserType.PLAYER) {
      router.push('/unauthorized');
    }
  }, [user, router]);
  
  // Fetch player statistics
  useEffect(() => {
    if (!user) return;
    
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Get co-players
        const coPlayersRes = await fetch('/api/player/coplayers');
        const coPlayersData = await coPlayersRes.json();
        
        if (coPlayersData.success) {
          setCoPlayers(coPlayersData.coplayers);
        }
        
        // Get most played with player
        const mostPlayedRes = await fetch('/api/player/most-played-with');
        const mostPlayedData = await mostPlayedRes.json();
        
        if (mostPlayedData.success) {
          setMostPlayedWith(mostPlayedData.player);
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
      <h1 className="text-2xl font-bold mb-6">Co-Player Statistics</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Most Played With</h2>
          
          {mostPlayedWith ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Player:</span>
                <span className="font-medium">{mostPlayedWith.name} {mostPlayedWith.surname}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Username:</span>
                <span className="font-medium">{mostPlayedWith.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ELO Rating:</span>
                <span className="font-medium">{mostPlayedWith.eloRating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Matches Played Together:</span>
                <span className="font-medium">{mostPlayedWith.matches_played}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">You haven't played any matches yet.</p>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">Players You've Played Against</h2>
        
        {coPlayers.length === 0 ? (
          <p className="p-4 text-gray-500">You haven't played against any players yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ELO Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matches Played</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coPlayers.map((player) => (
                  <tr key={player.username} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {player.name} {player.surname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {player.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {player.eloRating}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {player.matches_played}
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