'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UserType } from '@/domains/user/types';
import { Hall } from '@/domains/hall/types';

export default function ManageHalls() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedHall, setSelectedHall] = useState<string>('');
  const [newHallName, setNewHallName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Redirect if not a database manager
  useEffect(() => {
    if (user && user.userType !== UserType.MANAGER) {
      router.push('/unauthorized');
    }
  }, [user, router]);
  
  // Fetch halls data
  useEffect(() => {
    if (!user) return;
    
    const fetchHalls = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/halls');
        const data = await res.json();
        
        if (data.success) {
          setHalls(data.halls);
        } else {
          setError('Failed to load halls data');
        }
      } catch (err) {
        setError('An error occurred while fetching halls');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHalls();
  }, [user]);
  
  const handleSelectHall = (hallId: string) => {
    setSelectedHall(hallId);
    const hall = halls.find(h => h.hall_id.toString() === hallId);
    if (hall) {
      setNewHallName(hall.hall_name);
    }
  };
  
  const handleUpdateHallName = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedHall || !newHallName.trim()) {
      setError('Please select a hall and enter a new name');
      return;
    }
    
    try {
      setUpdateLoading(true);
      setError('');
      setSuccess('');
      
      const res = await fetch(`/api/halls/${selectedHall}/rename`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_name: newHallName.trim()
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess(`Hall name updated successfully to "${newHallName}"`);
        
        // Update local halls data
        setHalls(prevHalls => 
          prevHalls.map(hall => 
            hall.hall_id.toString() === selectedHall 
              ? { ...hall, hall_name: newHallName } 
              : hall
          )
        );
        
        // Reset form
        setSelectedHall('');
        setNewHallName('');
      } else {
        setError(data.message || 'Failed to update hall name');
      }
    } catch (err) {
      setError('An error occurred while updating hall name');
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };
  
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Chess Halls</h1>
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Rename Hall</h2>
          
          <form onSubmit={handleUpdateHallName} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Hall</label>
              <select
                value={selectedHall}
                onChange={(e) => handleSelectHall(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select a hall</option>
                {halls.map((hall) => (
                  <option key={hall.hall_id} value={hall.hall_id}>
                    {hall.hall_name} ({hall.hall_country})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Hall Name</label>
              <input
                type="text"
                value={newHallName}
                onChange={(e) => setNewHallName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter new hall name"
                required
                disabled={!selectedHall}
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                disabled={updateLoading || !selectedHall || !newHallName.trim()}
              >
                {updateLoading ? 'Updating...' : 'Update Hall Name'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">All Halls</h2>
        
        {halls.length === 0 ? (
          <p className="p-4 text-gray-500">No halls found in the database.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {halls.map((hall) => (
                  <tr key={hall.hall_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{hall.hall_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{hall.hall_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{hall.hall_country}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{hall.hall_capacity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleSelectHall(hall.hall_id.toString())}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Rename
                      </button>
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