'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { UserType } from '@/domains/user/types';
import { useRouter } from 'next/navigation';

interface Hall {
  hall_id: number;
  hall_name: string;
  hall_country: string;
  hall_capacity: number;
  table_count: number;
}

export default function ManageHallsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHall, setEditingHall] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [message, setMessage] = useState('');

  // Redirect if not a manager
  if (user?.userType !== UserType.MANAGER) {
    router.push('/dashboard');
    return null;
  }

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const response = await fetch('/api/halls/manage');
      const data = await response.json();

      if (data.success) {
        setHalls(data.halls);
      } else {
        setMessage(data.message || 'Failed to fetch halls');
      }
    } catch (error) {
      console.error('Error fetching halls:', error);
      setMessage('An error occurred while fetching halls');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (hall: Hall) => {
    setEditingHall(hall.hall_id);
    setNewName(hall.hall_name);
    setMessage('');
  };

  const cancelEditing = () => {
    setEditingHall(null);
    setNewName('');
  };

  const saveHallName = async (hallId: number) => {
    if (!newName.trim()) {
      setMessage('Hall name cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/halls/manage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hallId,
          newName: newName.trim()
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Hall name updated successfully!');
        setEditingHall(null);
        setNewName('');
        // Update the hall in the list
        setHalls(prev => prev.map(hall => 
          hall.hall_id === hallId 
            ? { ...hall, hall_name: newName.trim() }
            : hall
        ));
      } else {
        setMessage(data.message || 'Failed to update hall name');
      }
    } catch (error) {
      console.error('Error updating hall name:', error);
      setMessage('An error occurred while updating the hall name');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Halls
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Update hall names and view hall information
        </p>
      </header>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.includes('successfully') 
            ? 'bg-green-50 border-l-4 border-green-500 text-green-700'
            : 'bg-red-50 border-l-4 border-red-500 text-red-700'
        }`}>
          <p>{message}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Hall ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Hall Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tables
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {halls.map((hall) => (
                <tr key={hall.hall_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {hall.hall_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {editingHall === hall.hall_id ? (
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        autoFocus
                      />
                    ) : (
                      hall.hall_name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {hall.hall_country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {hall.hall_capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {hall.table_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingHall === hall.hall_id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => saveHallName(hall.hall_id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(hall)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Edit Name
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {halls.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No halls found</p>
          </div>
        )}
      </div>
    </div>
  );
} 