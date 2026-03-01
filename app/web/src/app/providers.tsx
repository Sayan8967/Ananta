"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useCallback, useEffect, createContext, useContext } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { initKeycloak, getToken, getUserRoles } from "@/lib/auth";

// ============================================================================
// React Query Provider
// ============================================================================

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000, // 1 minute
        retry: (failureCount, error) => {
          // Don't retry on 401/403 errors
          if (error instanceof Error && "status" in error) {
            const status = (error as Error & { status: number }).status;
            if (status === 401 || status === 403) return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

// ============================================================================
// Auth Provider
// ============================================================================

interface AuthContextValue {
  isInitialized: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isInitialized: false,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { setUser, clearUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    async function init() {
      try {
        const keycloak = await initKeycloak();

        if (keycloak.authenticated && keycloak.tokenParsed) {
          const roles = getUserRoles(keycloak);
          const token = getToken(keycloak);

          setUser({
            id: keycloak.tokenParsed.sub ?? "",
            name: keycloak.tokenParsed.name ?? keycloak.tokenParsed.preferred_username ?? "",
            email: keycloak.tokenParsed.email ?? "",
            roles,
            token: token ?? "",
          });
        }
      } catch (error) {
        console.warn("Keycloak initialization failed (may be expected in development):", error);
      } finally {
        setIsInitialized(true);
      }
    }

    init();
  }, [setUser]);

  const login = useCallback(async () => {
    try {
      const keycloak = await initKeycloak();
      keycloak.login({
        redirectUri: `${window.location.origin}/callback`,
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const keycloak = await initKeycloak();
      clearUser();
      keycloak.logout({
        redirectUri: window.location.origin,
      });
    } catch (error) {
      console.error("Logout failed:", error);
      clearUser();
    }
  }, [clearUser]);

  return (
    <AuthContext.Provider
      value={{
        isInitialized,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================================
// Combined Providers
// ============================================================================

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
