'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useSignin, useSignup, useSignout, useCurrentUser, authKeys, type User } from '@/lib/api/hooks/useAuth';
import type { SigninData, SignupData } from '@/lib/api/auth';
import { tokenCookies } from '@/lib/utils/cookies';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  signin: (data: SigninData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  // Helper to get user initials for display
  getUserInitials: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    data: user,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
    status: userStatus,
  } = useCurrentUser();
  const signinMutation = useSignin();
  const signupMutation = useSignup();
  const signoutMutation = useSignout();

  const initialHasResolvedAuth =
    typeof window !== 'undefined' ? !tokenCookies.getAccessToken() : false;
  const [hasResolvedAuth, setHasResolvedAuth] = useState(initialHasResolvedAuth);

  // Check if user is authenticated based on token presence
  const isAuthenticated =
    typeof window !== 'undefined' ? !!tokenCookies.getAccessToken() && !!user : false;

  const signin = async (data: SigninData) => {
    await signinMutation.mutateAsync(data);
  };

  const signup = async (data: SignupData) => {
    await signupMutation.mutateAsync(data);
  };

  const logout = async () => {
    await signoutMutation.mutateAsync();
    router.push('/');
  };

  const getUserInitials = (): string => {
    if (!user) return '';
    if (user.fullName) {
      const nameParts = user.fullName.trim().split(/\s+/);
      if (nameParts.length === 1) {
        return nameParts[0][0]?.toUpperCase() ?? 'U';
      }
      const firstInitial = nameParts[0][0]?.toUpperCase() ?? '';
      const lastInitial = nameParts[nameParts.length - 1][0]?.toUpperCase() ?? '';
      return `${firstInitial}${lastInitial}` || 'U';
    }
    if (user.firstName && user.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase();
    }
    if (user.firstName) {
      return user.firstName[0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Initialize user from cookies on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = tokenCookies.getAccessToken();
    if (!token) {
      setHasResolvedAuth(true);
      return;
    }

    if (!hasResolvedAuth && userStatus !== 'pending' && !isUserLoading && !isUserFetching) {
      setHasResolvedAuth(true);
    }

    if (token && !user) {
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    }
  }, [
    hasResolvedAuth,
    isUserFetching,
    isUserLoading,
    queryClient,
    user,
    userStatus,
  ]);

  const value: AuthContextType = {
    isAuthenticated,
    user: user || null,
    isLoading:
      !hasResolvedAuth ||
      isUserLoading ||
      isUserFetching ||
      signinMutation.isPending ||
      signupMutation.isPending ||
      signoutMutation.isPending,
    signin,
    signup,
    logout,
    getUserInitials,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
