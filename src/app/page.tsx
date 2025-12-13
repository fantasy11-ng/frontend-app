'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/components/home/LandingPage';
import HomePage from '@/components/home/HomePage';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const ready = true;

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

  if (!ready) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764948169/CominSoonBlue_b9r5cs.png"
            alt="Coming Soon"
            width={350}
            height={350}
          />
          <Link
            href="/predictor"
            className="bg-[#4AA96C] text-sm inline-flex items-center px-6 py-2 text-white font-medium rounded-full transition-colors"
          >
            Play Our Predictor Now
          </Link>
        </div>
      </div>
    );
  }

  // Show homepage for authenticated users, landing page for others
  return isAuthenticated ? <HomePage /> : <LandingPage />;
}
