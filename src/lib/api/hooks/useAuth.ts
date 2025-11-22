import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  authApi,
  SignupData,
  SigninData,
  PasswordResetRequestData,
  PasswordResetData,
  UpdateProfileData,
  UpdatePasswordData,
  ProfileImageUploadResponse,
  User,
} from '../auth';
import { tokenCookies } from '../../utils/cookies';
import toast from 'react-hot-toast';

// Re-export User type for convenience
export type { User };

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Signup mutation
export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignupData) => authApi.signup(data),
    onSuccess: async (responseData) => {
      // Store tokens in cookies
      tokenCookies.setAccessToken(responseData.accessToken);
      tokenCookies.setRefreshToken(responseData.refreshToken);
      // Fetch full user details to ensure we have firstName/lastName for initials
      try {
        const fullUser = await authApi.getCurrentUser();
        queryClient.setQueryData(authKeys.user(), fullUser);
      } catch (error) {
        console.error('Error fetching current user:', error);
        // If fetching fails, fall back to user from signup response
        queryClient.setQueryData(authKeys.user(), responseData.user);
      }
      toast.success('Account created successfully!');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Failed to create account';
      toast.error(errorMessage);
    },
  });
}

// Signin mutation
export function useSignin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SigninData) => authApi.signin(data),
    onSuccess: async (responseData) => {
      // Store tokens in cookies
      tokenCookies.setAccessToken(responseData.accessToken);
      tokenCookies.setRefreshToken(responseData.refreshToken);
      // Fetch full user details to ensure we have firstName/lastName for initials
      try {
        const fullUser = await authApi.getCurrentUser();
        queryClient.setQueryData(authKeys.user(), fullUser);
      } catch (error) {
        console.error('Error fetching current user:', error);
        // If fetching fails, fall back to user from signin response
        queryClient.setQueryData(authKeys.user(), responseData.user);
      }
      toast.success('Signed in successfully!');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Failed to sign in';
      toast.error(errorMessage);
    },
  });
}

// Signout mutation
export function useSignout() {
  return useMutation({
    mutationFn: () => authApi.signout(),
    onSuccess: () => {
      tokenCookies.removeAll();
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Failed to sign out';
      toast.error(errorMessage);
      tokenCookies.removeAll();
    },
  });
}

// Refresh token mutation
export function useRefreshToken() {
  return useMutation({
    mutationFn: (refreshToken: string) => authApi.refreshToken(refreshToken),
    onSuccess: (data) => {
      // Update access token in cookies
      tokenCookies.setAccessToken(data.accessToken);
    },
    onError: () => {
      // If refresh fails, clear tokens
      tokenCookies.removeAll();
    },
  });
}

// Request password reset mutation
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (data: PasswordResetRequestData) => authApi.requestPasswordReset(data),
    onSuccess: () => {
      toast.success('Password reset email sent! Check your inbox.');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Failed to send reset email';
      toast.error(errorMessage);
    },
  });
}

// Reset password mutation
export function useResetPassword() {
  return useMutation({
    mutationFn: (data: PasswordResetData) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully!');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Failed to reset password';
      toast.error(errorMessage);
    },
  });
}

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: authKeys.user(),
    queryFn: async (): Promise<User | null> => {
      if (typeof window !== 'undefined') {
        const token = tokenCookies.getAccessToken();
        if (!token) return null;
        
        try {
          return await authApi.getCurrentUser();
        } catch (error) {
          // If the request fails (e.g., token is invalid), clear tokens
          const axiosError = error as { response?: { status?: number } };
          if (axiosError?.response?.status === 401) {
            tokenCookies.removeAll();
          }
          throw error;
        }
      }
      return null;
    },
    enabled: typeof window !== 'undefined' && !!tokenCookies.getAccessToken(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => authApi.updateCurrentUser(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.user(), updatedUser);
      toast.success('Profile updated successfully!');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        axiosError?.response?.data?.message || axiosError?.message || 'Failed to update profile';
      toast.error(errorMessage);
    },
  });
}

export function useUploadProfileImage() {
  return useMutation<ProfileImageUploadResponse, unknown, File>({
    mutationFn: (file: File) => authApi.uploadProfileImage(file),
    onSuccess: () => {
      toast.success('Profile image uploaded');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        axiosError?.response?.data?.message || axiosError?.message || 'Failed to upload image';
      toast.error(errorMessage);
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (data: UpdatePasswordData) => authApi.updatePassword(data),
    onSuccess: () => {
      toast.success('Password updated successfully!');
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        axiosError?.response?.data?.message || axiosError?.message || 'Failed to update password';
      toast.error(errorMessage);
    },
  });
}

