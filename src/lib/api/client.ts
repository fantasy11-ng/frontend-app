import axios from 'axios';
import { tokenCookies } from '../utils/cookies';

const baseURL = 'https://backend-app-5srm.onrender.com/';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookies
    if (typeof window !== 'undefined') {
      const token = tokenCookies.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenCookies.getRefreshToken();
        if (refreshToken) {
          // Use a fresh axios instance without interceptors to avoid infinite loop
          const response = await axios.post(
            `${baseURL}auth/refresh`,
            { refreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          // Handle different response structures
          // Could be response.data.accessToken or response.data.data.accessToken
          const accessToken = response.data?.accessToken || response.data?.data?.accessToken;
          
          if (!accessToken) {
            console.error('Refresh token response structure:', response.data);
            throw new Error('No access token in refresh response');
          }

          // Set the access token in cookies
          if (typeof window !== 'undefined') {
            try {
              tokenCookies.setAccessToken(accessToken);
              
              // Small delay to ensure cookie is persisted
              await new Promise(resolve => setTimeout(resolve, 10));
              
              // Verify the cookie was set
              const verifyToken = tokenCookies.getAccessToken();
              if (!verifyToken || verifyToken !== accessToken) {
                console.error('Failed to set access token cookie after refresh', {
                  expected: accessToken,
                  actual: verifyToken,
                });
                throw new Error('Failed to persist access token');
              }
            } catch (cookieError) {
              console.error('Error setting access token cookie:', cookieError);
              throw cookieError;
            }
          }

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        if (typeof window !== 'undefined') {
          tokenCookies.removeAll();
          // You might want to redirect to login page here
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

