import { apiClient } from './client';

// Helper function to get the correct origin for OAuth redirects
const getRedirectOrigin = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  
  // Use window.location.origin which automatically detects the current domain
  // This works for both localhost (development) and deployed domains (production)
  return window.location.origin;
};

// Types
export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface PasswordResetRequestData {
  email: string;
}

export interface PasswordResetData {
  email: string;
  password: string;
  token: string;
}

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
  profileImageUrl?: string;
}

export interface ProfileImageUploadResponse {
  url: string;
  path: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

// User type
export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  isActive?: boolean;
  googleId?: string;
  facebookId?: string;
  refreshToken?: string;
  role?: string;
  profileImageUrl?: string;
};

// Auth API functions
export const authApi = {
  // POST /auth/signup - Create a new user account
  signup: async (data: SignupData): Promise<AuthResponse['data']> => {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    return response.data.data;
  },

  // POST /auth/signin - Sign in with email and password
  signin: async (data: SigninData): Promise<AuthResponse['data']> => {
    const response = await apiClient.post<AuthResponse>('/auth/signin', data);
    return response.data.data;
  },

  // POST /auth/signout - Sign out and revoke refresh token
  signout: async (): Promise<void> => {
    await apiClient.post('/auth/signout');
  },

  // GET /auth/google - Initiate Google OAuth flow
  // This should redirect to Google OAuth, so we return the URL
  initiateGoogleOAuth: (): string => {
    const origin = getRedirectOrigin();
    const redirectUri = origin ? `${origin}/auth/google/callback` : '';
    return `${apiClient.defaults.baseURL}auth/google${redirectUri ? `?redirect_uri=${encodeURIComponent(redirectUri)}` : ''}`;
  },

  // GET /auth/google/callback - Google OAuth callback
  // This is typically handled server-side, but we can check the callback
  handleGoogleCallback: async (code: string): Promise<AuthResponse['data']> => {
    const response = await apiClient.get<AuthResponse>('/auth/google/callback', {
      params: { code },
    });
    return response.data.data;
  },

  // GET /auth/facebook - Initiate Facebook OAuth flow
  initiateFacebookOAuth: (): string => {
    const origin = getRedirectOrigin();
    const redirectUri = origin ? `${origin}/auth/facebook/callback` : '';
    return `${apiClient.defaults.baseURL}auth/facebook${redirectUri ? `?redirect_uri=${encodeURIComponent(redirectUri)}` : ''}`;
  },

  // GET /auth/facebook/callback - Facebook OAuth callback
  handleFacebookCallback: async (code: string): Promise<AuthResponse['data']> => {
    const response = await apiClient.get<AuthResponse>('/auth/facebook/callback', {
      params: { code },
    });
    return response.data.data;
  },

  // POST /auth/refresh - Refresh access token using refresh token
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  // POST /auth/password/request - Request a password reset email
  requestPasswordReset: async (data: PasswordResetRequestData): Promise<void> => {
    await apiClient.post('/auth/password/request', data);
  },

  // POST /auth/password/reset - Reset password using reset token
  resetPassword: async (data: PasswordResetData): Promise<void> => {
    await apiClient.post('/auth/password/reset', data);
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<{ success: boolean; data: User }>('/users/me');
    return response.data.data;
  },

  updateCurrentUser: async (data: UpdateProfileData): Promise<User> => {
    const response = await apiClient.patch<{ success: boolean; data: User }>('/users/me', data);
    return response.data.data;
  },

  uploadProfileImage: async (file: File): Promise<ProfileImageUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<{ success: boolean; data: ProfileImageUploadResponse }>(
      '/files/profile-image',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    return response.data.data;
  },

  updatePassword: async (data: UpdatePasswordData): Promise<void> => {
    await apiClient.patch('/users/me/password', data);
  },
};

