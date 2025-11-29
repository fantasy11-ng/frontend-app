'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useOAuthCallback } from '@/lib/api/hooks/useOAuth';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthCallback = useOAuthCallback();

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
        onSuccess: () => {
          // User data is already fetched and set in the hook
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
  }, [code, error, oauthCallback, router]);

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

