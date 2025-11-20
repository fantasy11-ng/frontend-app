import Cookies from 'js-cookie';

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

// Cookie options - adjust as needed
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  
  return {
    secure: isProduction && isHttps, // Only use secure in production with HTTPS
    sameSite: 'lax' as const, // Changed from 'strict' to 'lax' for better compatibility
    expires: 7, // 7 days
    path: '/', // Ensure cookie is available site-wide
  };
};

export const tokenCookies = {
  getAccessToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEYS.REFRESH_TOKEN);
  },

  setAccessToken: (token: string): void => {
    try {
      Cookies.set(TOKEN_KEYS.ACCESS_TOKEN, token, getCookieOptions());
      // Verify cookie was set
      if (typeof window !== 'undefined' && !Cookies.get(TOKEN_KEYS.ACCESS_TOKEN)) {
        console.error('Failed to set access token cookie');
      }
    } catch (error) {
      console.error('Error setting access token cookie:', error);
      throw error;
    }
  },

  setRefreshToken: (token: string): void => {
    try {
      Cookies.set(TOKEN_KEYS.REFRESH_TOKEN, token, getCookieOptions());
      // Verify cookie was set
      if (typeof window !== 'undefined' && !Cookies.get(TOKEN_KEYS.REFRESH_TOKEN)) {
        console.error('Failed to set refresh token cookie');
      }
    } catch (error) {
      console.error('Error setting refresh token cookie:', error);
      throw error;
    }
  },

  removeAccessToken: (): void => {
    Cookies.remove(TOKEN_KEYS.ACCESS_TOKEN);
  },

  removeRefreshToken: (): void => {
    Cookies.remove(TOKEN_KEYS.REFRESH_TOKEN);
  },

  removeAll: (): void => {
    Cookies.remove(TOKEN_KEYS.ACCESS_TOKEN);
    Cookies.remove(TOKEN_KEYS.REFRESH_TOKEN);
  },
};

