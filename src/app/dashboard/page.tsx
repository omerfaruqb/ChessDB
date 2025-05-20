'use client';

import { useAuth } from '@/domains/auth/hooks/useAuth';
import { UserType } from '@/domains/user/types';
import Link from 'next/link';

// Dashboard widgets for each role
const PlayerDashboard = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <DashboardCard
      title="My Matches"
      description="View your past and upcoming matches"
      linkText="View Matches"
      linkHref="/dashboard/matches"
    />
    <DashboardCard
      title="Co-Player Statistics"
      description="See statistics about players you've played with"
      linkText="View Statistics"
      linkHref="/dashboard/coplayer-stats"
    />
  </div>
);

const CoachDashboard = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <DashboardCard
      title="Create Match"
      description="Schedule a new match for your team"
      linkText="Create Match"
      linkHref="/dashboard/matches/create"
    />
    <DashboardCard
      title="Assign Players"
      description="Select players for upcoming matches"
      linkText="Assign Players"
      linkHref="/dashboard/matches/assign"
    />
    <DashboardCard
      title="View Halls"
      description="Browse available chess halls"
      linkText="View Halls"
      linkHref="/dashboard/halls"
    />
  </div>
);

const ArbiterDashboard = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <DashboardCard
      title="Rate Matches"
      description="Rate matches you are assigned to"
      linkText="Rate Matches"
      linkHref="/dashboard/matches/rate"
    />
    <DashboardCard
      title="Rating Statistics"
      description="View your rating history and statistics"
      linkText="View Statistics"
      linkHref="/dashboard/rating-stats"
    />
  </div>
);

const ManagerDashboard = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <DashboardCard
      title="Manage Halls"
      description="Update information about chess halls"
      linkText="Manage Halls"
      linkHref="/dashboard/halls/manage"
    />
    <DashboardCard
      title="Create Users"
      description="Create new players, coaches, and arbiters"
      linkText="Create Users"
      linkHref="/dashboard/users/create"
    />
  </div>
);

// Simple dashboard card component
const DashboardCard = ({ title, description, linkText, linkHref }: { 
  title: string; 
  description: string; 
  linkText: string; 
  linkHref: string;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
    <Link 
      href={linkHref}
      className="inline-block px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      {linkText}
    </Link>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {user.name || user.username}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Chess Tournament Management Dashboard
        </p>
      </header>

      {/* Render dashboard widgets based on user role */}
      {user.userType === UserType.PLAYER && <PlayerDashboard />}
      {user.userType === UserType.COACH && <CoachDashboard />}
      {user.userType === UserType.ARBITER && <ArbiterDashboard />}
      {user.userType === UserType.MANAGER && <ManagerDashboard />}
    </div>
  );
} 