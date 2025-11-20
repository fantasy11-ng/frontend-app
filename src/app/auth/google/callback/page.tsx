'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOAuthCallback } from '@/lib/api/hooks/useOAuth';
import { useQueryClient } from '@tanstack/react-query';
import { authKeys } from '@/lib/api/hooks/useAuth';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthCallback = useOAuthCallback();
  const queryClient = useQueryClient();

  const code = searchParams.get('code');
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      // Handle OAuth error
      router.push('/sign-in?error=oauth_failed');
      return;
    }

    if (!code) {
      // No code in URL, redirect to sign in
      router.push('/sign-in?error=no_code');
      return;
    }

    // Prevent multiple calls
    if (oauthCallback.isPending || oauthCallback.isSuccess) {
      return;
    }

    // Call the OAuth callback API
    oauthCallback.mutate(
      { provider: 'google', code },
      {
        onSuccess: (responseData) => {
          // Update auth state with user data
          queryClient.setQueryData(authKeys.user(), responseData.user);
          // Small delay to ensure state is updated
          setTimeout(() => {
            router.push('/');
          }, 100);
        },
        onError: () => {
          // Error toast is handled in the hook
          setTimeout(() => {
            router.push('/sign-in?error=oauth_failed');
          }, 2000);
        },
      }
    );
  }, [code, error, oauthCallback, router, queryClient]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing Google sign in...</p>
      </div>
    </div>
  );
}

