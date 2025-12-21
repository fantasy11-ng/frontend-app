'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Admin credentials (frontend-only auth)
const ADMIN_CREDENTIALS = {
  username: 'admin-fantasy',
  password: 'Fx8$mK2pL9#wQz3',
};

const ADMIN_SESSION_KEY = 'cms_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface AdminSession {
  authenticated: boolean;
  expiresAt: number;
}

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  adminLogin: (username: string, password: string) => { success: boolean; error?: string };
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const router = useRouter();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkSession = () => {
      try {
        const sessionData = sessionStorage.getItem(ADMIN_SESSION_KEY);
        if (sessionData) {
          const session: AdminSession = JSON.parse(sessionData);
          if (session.authenticated && session.expiresAt > Date.now()) {
            setIsAdminAuthenticated(true);
          } else {
            // Session expired, clear it
            sessionStorage.removeItem(ADMIN_SESSION_KEY);
            setIsAdminAuthenticated(false);
          }
        }
      } catch {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setIsAdminAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const adminLogin = (username: string, password: string): { success: boolean; error?: string } => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const session: AdminSession = {
        authenticated: true,
        expiresAt: Date.now() + SESSION_DURATION,
      };
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      setIsAdminAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  const adminLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdminAuthenticated(false);
    router.push('/cms-k9x2m7p4');
  };

  const value: AdminAuthContextType = {
    isAdminAuthenticated,
    isLoading,
    adminLogin,
    adminLogout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

