'use client';

import { useEffect } from 'react';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-6xl font-bold text-red-600">403</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Unauthorized Access</h2>
          <p className="mt-3 text-lg text-gray-600">
            You don't have permission to access this page.
          </p>
          {user && (
            <p className="mt-2 text-gray-600">
              Your role ({user.userType.toLowerCase()}) doesn't have access to this resource.
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Log In
            </Link>
          )}
          
          <div className="mt-2">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 