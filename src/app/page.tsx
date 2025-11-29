'use client';

import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/components/home/LandingPage';
import HomePage from '@/components/home/HomePage';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state or landing page while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  // Show homepage for authenticated users, landing page for others
  return isAuthenticated ? <HomePage /> : <LandingPage />;
}
