'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Spinner } from '@/components/common/Spinner';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const router = useRouter();
  const { isAdminAuthenticated, isLoading } = useAdminAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect after mounting and loading is complete
    if (mounted && !isLoading && !isAdminAuthenticated) {
      router.push('/cms-k9x2m7p4');
    }
  }, [mounted, isLoading, isAdminAuthenticated, router]);

  // Show loading state during SSR or while checking auth
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size={32} className="text-emerald-600" />
      </div>
    );
  }

  // Don't render children if not authenticated (will redirect)
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size={32} className="text-emerald-600" />
      </div>
    );
  }

  return <>{children}</>;
}
