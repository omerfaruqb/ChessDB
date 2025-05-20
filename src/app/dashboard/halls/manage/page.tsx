'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { UserType } from '@/domains/user/types';
import { AuthGuard } from '@/shared/middleware/authMiddleware';
import { Hall } from '@/domains/hall/types';

export default function ManageHallsPage() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);
  const [newHallName, setNewHallName] = useState('');

  useEffect(() => {
    fetchHalls();
  }, []);

  async function fetchHalls() {
    try {
      setLoading(true);
      const response = await fetch('/api/halls');
      if (!response.ok) {
        throw new Error('Failed to fetch halls');
      }
      const data = await response.json();
      setHalls(data);
    } catch (err) {
      setError('Error loading halls. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function startEditing(hall: Hall) {
    setEditingHall(hall);
    setNewHallName(hall.hall_name);
  }

  function cancelEditing() {
    setEditingHall(null);
    setNewHallName('');
  }

  async function updateHallName() {
    if (!editingHall || !newHallName.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/halls/${editingHall.hall_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hall_name: newHallName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update hall name');
      }

      setSuccess(`Hall "${editingHall.hall_name}" renamed to "${newHallName}"`);
      setEditingHall(null);
      setNewHallName('');
      
      // Refresh the halls list
      fetchHalls();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error updating hall name. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading && halls.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthGuard allowedRoles={[UserType.MANAGER]}>
      <div>
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Manage Halls</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {halls.length > 0 ? (
                halls.map((hall) => (
                  <tr key={hall.hall_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {hall.hall_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {editingHall?.hall_id === hall.hall_id ? (
                        <input
                          type="text"
                          value={newHallName}
                          onChange={(e) => setNewHallName(e.target.value)}
                          className="px-2 py-1 border rounded-md w-full text-gray-900 dark:text-white dark:bg-gray-700"
                        />
                      ) : (
                        hall.hall_name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {hall.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {hall.capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {editingHall?.hall_id === hall.hall_id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={updateHallName}
                            className="text-green-600 hover:text-green-800 font-medium"
                            disabled={loading}
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-red-600 hover:text-red-800 font-medium"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(hall)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Rename
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No halls found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGuard>
  );
} 