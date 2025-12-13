'use client';

import { useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { tokenCookies } from '@/lib/utils/cookies';
import { authApi } from '@/lib/api/auth';
import { authKeys } from '@/lib/api/hooks/useAuth';
import toast from 'react-hot-toast';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple calls
    if (hasProcessed.current) {
      return;
    }

    // Extract query params
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const role = searchParams.get('role');
    const error = searchParams.get('error');

    // Handle error case
    if (error) {
      toast.error('Authentication failed. Please try again.');
      setTimeout(() => {
        router.push('/sign-in?error=oauth_failed');
      }, 2000);
      return;
    }

    // Validate required params
    if (!accessToken || !refreshToken || !userId || !email) {
      toast.error('Missing authentication information. Please try again.');
      setTimeout(() => {
        router.push('/sign-in?error=missing_params');
      }, 2000);
      return;
    }

    hasProcessed.current = true;

    // Store tokens in cookies
    tokenCookies.setAccessToken(accessToken);
    tokenCookies.setRefreshToken(refreshToken);

    // Fetch full user details and set in query cache
    authApi
      .getCurrentUser()
      .then((user) => {
        queryClient.setQueryData(authKeys.user(), user);
        toast.success('Signed in with Google successfully!');
        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push('/');
        }, 100);
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
        // If fetching fails, create a minimal user object from query params
        const minimalUser = {
          id: userId,
          email,
          role: role || undefined,
        };
        queryClient.setQueryData(authKeys.user(), minimalUser);
        toast.success('Signed in with Google successfully!');
        setTimeout(() => {
          router.push('/');
        }, 100);
      });
  }, [searchParams, router, queryClient]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-green-600" />
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}

