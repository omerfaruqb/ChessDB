'use client';

import { useAuth } from '@/domains/auth/hooks/useAuth';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Access Denied</h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You don't have permission to access this page. This area is restricted to authorized users only.
        </p>
        
        {user ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Logged in as <span className="font-semibold">{user.username}</span> (Role: {user.userType})
          </div>
        ) : null}
        
        <div className="flex flex-col space-y-3">
          <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            Go to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
} 