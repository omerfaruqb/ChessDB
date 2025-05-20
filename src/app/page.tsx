'use client';

import { useAuth } from '@/domains/auth/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <section className="py-16 px-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">ChessDB</h1>
              <p className="text-xl md:text-2xl mb-8">
                Tournament Management System
              </p>
              <p className="text-blue-100 mb-8 text-lg">
                A comprehensive platform for managing chess tournaments in compliance with FIDE standards.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="bg-white text-blue-700 hover:bg-blue-50 transition-colors px-6 py-3 rounded-md font-medium"
                >
                  Log In
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <Image
                  src="/chess-tournament.svg"
                  alt="Chess Tournament"
                  width={500}
                  height={300}
                  className="w-full"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 px-8 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Role-Based Access"
              description="Different interfaces and capabilities for players, coaches, arbiters, and database managers."
            />
            <FeatureCard 
              title="Match Management"
              description="Schedule, assign players, and rate matches with built-in validation for tournament rules."
            />
            <FeatureCard
              title="Statistical Analysis"
              description="Track player performance, match histories, and rating statistics."
            />
          </div>
        </div>
      </section>

      <footer className="py-8 px-8 bg-gray-800 text-white text-center">
        <p>ChessDB Tournament Management System</p>
        <p className="text-gray-400 text-sm mt-2">CMPE 321 - Spring 2025</p>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
