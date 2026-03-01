import { create } from "zustand";
import { persist } from "zustand/middleware";

// =============================================================================
// Auth Store - Zustand store for authentication state
// =============================================================================

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  token: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;

  setUser: (user: AuthUser) => void;
  updateToken: (token: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user: AuthUser) =>
        set({
          user,
          token: user.token,
          isAuthenticated: true,
        }),

      updateToken: (token: string) =>
        set((state) => ({
          token,
          user: state.user ? { ...state.user, token } : null,
        })),

      clearUser: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "ananta-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
