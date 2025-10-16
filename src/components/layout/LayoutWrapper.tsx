'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <Navbar 
        isAuthenticated={isAuthenticated}
        userInitials={user?.initials || 'FF'}
      />
      <main className="pt-16">
        {children}
      </main>
    </>
  );
}
