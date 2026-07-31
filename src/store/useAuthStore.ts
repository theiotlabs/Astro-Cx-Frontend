import { create } from 'zustand';

export interface CustomerUser {
  id: number;
  cx_id?: string;
  username?: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender?: string;
  city?: string;
  state?: string;
}

interface AuthState {
  user: CustomerUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: CustomerUser, accessToken: string, refreshToken: string) => void;
  updateUser: (user: Partial<CustomerUser>) => void;
  logout: () => void;
}

const getStoredToken = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const getStoredUser = (): CustomerUser | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('astro_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
  return null;
};

const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  accessToken: getStoredToken('astro_access_token'),
  refreshToken: getStoredToken('astro_refresh_token'),
  isAuthenticated: !!getStoredToken('astro_access_token'),

  setAuth: (user, accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('astro_access_token', accessToken);
      localStorage.setItem('astro_refresh_token', refreshToken);
      localStorage.setItem('astro_user', JSON.stringify(user));
      // Save access token to cookie for Next.js middleware access
      // max-age aligned with refresh token lifetime (30 days)
      document.cookie = `astro_access_token=${accessToken}; path=/; max-age=2592000; SameSite=Lax;`;
    }
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },

  updateUser: (updatedFields) => {
    set((state) => {
      const newUser = state.user ? { ...state.user, ...updatedFields } : null;
      if (typeof window !== 'undefined' && newUser) {
        localStorage.setItem('astro_user', JSON.stringify(newUser));
      }
      return { user: newUser };
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('astro_access_token');
      localStorage.removeItem('astro_refresh_token');
      localStorage.removeItem('astro_user');
      document.cookie = 'astro_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
