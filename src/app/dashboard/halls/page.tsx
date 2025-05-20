'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { Hall } from '@/domains/hall/types';
import Link from 'next/link';

export default function HallsPage() {
  const { user } = useAuth();
  
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Fetch halls data
  useEffect(() => {
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
  }, []);
  
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chess Halls</h1>
        
        {user?.userType === 'MANAGER' && (
          <Link
            href="/dashboard/halls/manage"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Manage Halls
          </Link>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {halls.map((hall) => (
                  <tr key={hall.hall_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{hall.hall_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{hall.hall_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{hall.hall_country}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{hall.hall_capacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {halls.slice(0, 3).map((hall) => (
          <div key={hall.hall_id} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">{hall.hall_name}</h2>
            <p className="text-gray-500 mb-4">Location: {hall.hall_country}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Capacity:</span>
              <span className="font-medium">{hall.hall_capacity} tables</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 