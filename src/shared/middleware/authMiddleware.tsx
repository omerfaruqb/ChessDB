'use client';

import { useAuth } from '@/domains/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserType } from '@/domains/user/types';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserType[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    if (!loading && user && allowedRoles && !allowedRoles.includes(user.userType)) {
      router.push('/unauthorized');
    }
  }, [loading, user, router, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.userType)) {
    return null;
  }

  return <>{children}</>;
} 