'use client';

import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/components/home/LandingPage';
import HomePage from '@/components/home/HomePage';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state or landing page while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Show homepage for authenticated users, landing page for others
  return isAuthenticated ? <HomePage /> : <LandingPage />;
}
