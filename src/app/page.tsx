'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/components/home/LandingPage';
import HomePage from '@/components/home/HomePage';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Wait for client-side hydration to complete
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render nothing or a placeholder during SSR to avoid hydration mismatch
  // The loading state will only show after the component mounts on client
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  // Show loading state while checking auth (only after mount)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  // Show homepage for authenticated users, landing page for others
  return isAuthenticated ? <HomePage /> : <LandingPage />;
}
