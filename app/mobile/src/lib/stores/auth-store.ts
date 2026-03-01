import { create } from 'zustand';
import { UserInfo, login as keycloakLogin, logout as keycloakLogout, getStoredUser, isAuthenticated } from '../auth';

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      const authenticated = await isAuthenticated();
      if (authenticated) {
        const user = await getStoredUser();
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false, error: 'Failed to initialize auth' });
    }
  },

  login: async () => {
    try {
      set({ isLoading: true, error: null });
      const tokens = await keycloakLogin();
      if (tokens) {
        const user = await getStoredUser();
        set({ user, isAuthenticated: true, isLoading: false });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      set({ isLoading: false, error: 'Login failed' });
      return false;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await keycloakLogout();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: 'Logout failed' });
    }
  },
}));
