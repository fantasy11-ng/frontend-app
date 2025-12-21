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
  
  // Hide navbar on auth pages, landing page (when not authenticated), and CMS pages
  const isAuthPage = pathname?.startsWith('/sign-in') || 
                     pathname?.startsWith('/sign-up') || 
                     pathname?.startsWith('/reset-password');
  
  // Check if it's a CMS/admin page
  const isCmsPage = pathname?.startsWith('/cms-');
  
  // Show navbar only for authenticated users on home page, or on other pages (excluding CMS)
  const shouldShowNavbar = !isAuthPage && !isCmsPage && (isAuthenticated || pathname !== '/');

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main className={shouldShowNavbar ? 'pt-16' : ''}>
        {children}
      </main>
    </>
  );
}
