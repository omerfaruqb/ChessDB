'use client';

import { useAuth } from '@/domains/auth/hooks/useAuth';
import { UserType } from '@/domains/user/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/shared/middleware/authMiddleware';

const navLinks = {
  [UserType.PLAYER]: [
    { label: 'My Profile', href: '/dashboard/profile' },
    { label: 'My Matches', href: '/dashboard/matches' },
    { label: 'Co-Player Statistics', href: '/dashboard/coplayer-stats' },
  ],
  [UserType.COACH]: [
    { label: 'My Profile', href: '/dashboard/profile' },
    { label: 'My Team', href: '/dashboard/team' },
    { label: 'My Matches', href: '/dashboard/matches' },
    { label: 'Create Match', href: '/dashboard/matches/create' },
    { label: 'Assign Players', href: '/dashboard/matches/assign' },
    { label: 'View Halls', href: '/dashboard/halls' },
  ],
  [UserType.ARBITER]: [
    { label: 'My Profile', href: '/dashboard/profile' },
    { label: 'Rate Matches', href: '/dashboard/matches/rate' },
    { label: 'Rating Statistics', href: '/dashboard/rating-stats' },
  ],
  [UserType.MANAGER]: [
    { label: 'My Profile', href: '/dashboard/profile' },
    { label: 'Manage Halls', href: '/dashboard/halls/manage' },
    { label: 'Create Users', href: '/dashboard/users/create' },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const userNavLinks = navLinks[user.userType] || [];

  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">ChessDB</h2>
            <p className="text-sm text-gray-400 mt-1">{user.userType} Dashboard</p>
          </div>
          
          <nav className="mt-6">
            <ul className="space-y-2">
              {userNavLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className={`flex items-center px-4 py-2 text-sm ${
                      pathname === link.href
                        ? 'bg-blue-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">{user.username.substring(0, 1).toUpperCase()}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-gray-400">{user.userType}</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
            >
              Log Out
            </button>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
} 