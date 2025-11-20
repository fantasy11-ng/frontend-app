import { useMutation } from '@tanstack/react-query';
import { authApi } from '../auth';
import { tokenCookies } from '../../utils/cookies';
import toast from 'react-hot-toast';

// Google OAuth hook
export function useGoogleOAuth() {
  return useMutation({
    mutationFn: async () => {
      // Redirect to Google OAuth
      window.location.href = authApi.initiateGoogleOAuth();
      return Promise.resolve();
    },
  });
}

// Facebook OAuth hook
export function useFacebookOAuth() {
  return useMutation({
    mutationFn: async () => {
      // Redirect to Facebook OAuth
      window.location.href = authApi.initiateFacebookOAuth();
      return Promise.resolve();
    },
  });
}

// Handle OAuth callback (typically used in a callback page)
export function useOAuthCallback() {
  return useMutation({
    mutationFn: async ({ provider, code }: { provider: 'google' | 'facebook'; code: string }) => {
      if (provider === 'google') {
        return { ...await authApi.handleGoogleCallback(code), provider };
      } else {
        return { ...await authApi.handleFacebookCallback(code), provider };
      }
    },
    onSuccess: (responseData) => {
      // Store tokens in cookies
      tokenCookies.setAccessToken(responseData.accessToken);
      tokenCookies.setRefreshToken(responseData.refreshToken);
      const providerName = responseData.provider === 'google' ? 'Google' : 'Facebook';
      toast.success(`Signed in with ${providerName} successfully!`);
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'OAuth authentication failed';
      toast.error(errorMessage);
    },
  });
}

