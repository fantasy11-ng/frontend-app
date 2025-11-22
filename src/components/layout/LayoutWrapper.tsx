'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  
  // Hide navbar on auth pages and landing page (when not authenticated)
  const isAuthPage = pathname?.startsWith('/sign-in') || 
                     pathname?.startsWith('/sign-up') || 
                     pathname?.startsWith('/reset-password');
  
  // Show navbar only for authenticated users on home page, or on other pages
  const shouldShowNavbar = !isAuthPage && (isAuthenticated || pathname !== '/');

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main className={shouldShowNavbar ? 'pt-16' : ''}>
        {children}
      </main>
    </>
  );
}
