'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { UserType } from '@/domains/user/types';
import { AuthGuard } from '@/shared/middleware/authMiddleware';
import { Hall } from '@/domains/hall/types';

export default function HallsPage() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHalls() {
      try {
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

    fetchHalls();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <AuthGuard allowedRoles={[UserType.COACH]}>
      <div>
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Available Halls</h1>
        
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
                      {hall.hall_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {hall.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {hall.capacity}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
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